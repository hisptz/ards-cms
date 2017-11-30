// import {
//   Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy,
//   ChangeDetectorRef
// } from '@angular/core';
// import * as _ from 'lodash';
//
// const PERIOD_TYPE: Array<any> = [
//   {value:'Monthly', name: 'Monthly', shown: true},
//   {value:'BiMonthly', name: 'BiMonthly', shown: false},
//   {value:'Quarterly', name: 'Quarterly', shown: true},
//   {value:'SixMonthly', name: 'Six-Monthly', shown: false},
//   {value:'SixMonthlyApril', name: 'Six-Monthly April', shown: false},
//   {value:'Yearly', name: 'Yearly', shown: true},
//   {value:'FinancialApril', name: 'Financial-April', shown: false},
//   {value:'FinancialJuly', name: 'Financial-July', shown: true},
//   {value:'FinancialOct', name: 'Financial-Oct', shown: false},
// ];
//
// @Component({
//   selector: 'app-period-selector',
//   templateUrl: './period-selector.component.html',
//   styleUrls: ['./period-selector.component.css'],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class PeriodSelectorComponent implements OnInit {
//
//   @Input() period_tree_config: any = {
//     show_search : false,
//     search_text : 'Search',
//     level: null,
//     loading: false,
//     loading_message: 'Loading Periods...',
//     multiple: false,
//     multiple_key:"none", //can be control or shift
//     starting_periods: [],
//     starting_year: null,
//     placeholder: "Select period"
//   };
//   @Input() periodOptions$: any;
//   periodOptions: any;
//   selected_periods:any[] = [];
//   selectedPeriodId: string = '';
//   @Output() onPeriodUpdate: EventEmitter<any> = new EventEmitter<any>();
//   periods = [];
//   period: any = {};
//   period_type: string = 'Monthly';
//   year: number;
//   currentYear: number;
//   currentMonth: number;
//   period_type_config: Array<any>;
//
//   constructor(private ref: ChangeDetectorRef) {
//     let date = new Date();
//     this.period_tree_config.starting_year = date.getFullYear();
//     this.year = date.getFullYear();
//     this.currentYear = date.getFullYear();
//     this.currentMonth = date.getMonth();
//     let datestring = date.getFullYear() + ("0"+(date.getMonth()+1)).slice(-2);
//     this.period_tree_config.starting_periods=[datestring];
//     if(!this.period_tree_config.hasOwnProperty("multiple_key")){
//       this.period_tree_config.multiple_key = "none";
//     }
//   }
//
//   ngOnInit() {
//     this.periodOptions$.subscribe(periodOptions => {
//       // this.resetSelection();
//       this.periodOptions = periodOptions;
//       this.period_type = this.getInitialPeriodType(periodOptions, this.period_type);
//       this.changePeriodType();
//       this.ref.markForCheck();
//     });
//
//     this.period_type_config = PERIOD_TYPE;
//     if(this.period_type != '') {
//       this.changePeriodType();
//     }
//   }
//
//   getInitialPeriodType(periodOptions, initialPeriodType) {
//     let periodType: string = '';
//     if(periodOptions.hideMonth == false) {
//       periodType = initialPeriodType !== '' ? initialPeriodType : 'Monthly';
//     } else if(periodOptions.hideMonth == true && periodOptions.hideQuarter == false) {
//       periodType = initialPeriodType === 'FinancialJuly' ? initialPeriodType : 'Quarterly';
//     } else if(periodOptions.hideMonth == true && periodOptions.hideQuarter == true && periodOptions.hideFinancialJuly == false) {
//       periodType = 'FinancialJuly';
//     }
//
//     return periodType;
//   }
//
//
//   transferDataSuccess(data,current){
//     if(data.dragData.id == current.id){
//     }else{
//       let number = (this.getPeriodPosition(data.dragData.id) > this.getPeriodPosition(current.id))?0:1;
//       this.deletePeriod( data.dragData );
//       this.insertPeriod( data.dragData, current, number);
//     }
//   }
//
//   // helper method to find the index of dragged item
//   getPeriodPosition(period_id){
//     let period_index = null;
//     this.selected_periods.forEach((period, index) => {
//       if(period.id == period_id){
//         period_index = index;
//       }
//     });
//     return period_index;
//   }
//
//   // help method to delete the selected period in list before inserting it in another position
//   deletePeriod( period_to_delete ){
//     this.selected_periods.forEach((period, period_index) => {
//       if( period_to_delete.id == period.id){
//         this.selected_periods.splice(period_index,1);
//       }
//     });
//   }
//
//   // Helper method to insert period in new position after drag drop event
//   insertPeriod( period_to_insert, current_period, num:number ){
//     this.selected_periods.forEach((period, period_index) => {
//       if( current_period.id == period.id && !this.checkPeriodAvailabilty(period_to_insert,this.selected_periods) ){
//         this.selected_periods.splice(period_index+num,0,period_to_insert);
//       }
//     });
//   }
//
//   activateNode(nodeId:any, nodes){
//     setTimeout(() => {
//       let node = nodes.treeModel.getNodeById(nodeId);
//       if (node)
//         node.setIsActive(true, true);
//     }, 0);
//   }
//
//   // a method to activate the model
//   deActivateNode(nodeId:any, nodes, event){
//     setTimeout(() => {
//       let node = nodes.treeModel.getNodeById(nodeId);
//       if (node)
//         node.setIsActive(false, true);
//     }, 0);
//     if( event != null){
//       event.stopPropagation();
//     }
//   }
//
//   pushPeriodForward(){
//     this.year += 1;
//     this.periods = this.getPeriodArray(this.period_type,this.year);
//     this.selectedPeriodId = this.periods.length > 0 ? this.periods[0].id : '0';
//     const period = this.periods.filter(period => {return period.id == this.selectedPeriodId});
//     this.onPeriodUpdate.emit(period.length > 0 ? period[0] : {});
//   }
//
//   pushPeriodBackward(){
//     this.year -= 1;
//     this.periods = this.getPeriodArray(this.period_type,this.year);
//     this.selectedPeriodId = this.periods.length > 0 ? this.periods[0].id : '0';
//     const period = this.periods.filter(period => {return period.id == this.selectedPeriodId});
//     this.onPeriodUpdate.emit(period.length > 0 ? period[0] : {});
//   }
//
//   changePeriodType(){
//     if(this.period_type != '') {
//       this.periods = this.getPeriodArray(this.period_type,this.year);
//       if(this.periods.filter(period => {return period.id == this.selectedPeriodId}).length === 0) {
//         this.selectedPeriodId = this.periods.length > 0 ? this.periods[0].id : '0';
//       }
//
//       const period = this.periods.filter(period => {return period.id == this.selectedPeriodId});
//       this.onPeriodUpdate.emit(period.length > 0 ? period[0] : {});
//     }
//   }
//
//   // get the name of period to be used in a tittle
//   getPeriodName(id){
//     for ( let period of this.getPeriodArray(this.period_type, this.getLastPeriod(id,this.period_type).substr(0,4))){
//       if( this.getLastPeriod(id,this.period_type) == period.id){
//         return period.name;
//       }
//     }
//   }
//
//
//   // display period Tree
//   displayPerTree(){
//     // this.showPerTree = !this.showPerTree;
//   }
//
//   // action to be called when a tree item is deselected(Remove item in array of selected items
//   deactivatePer ( $event ) {
//     this.selected_periods.splice(this.selected_periods.indexOf($event),1)
//   };
//
//   // add item to array of selected items when item is selected
//   activatePer($event) {
//     if(!this.checkPeriodAvailabilty($event,this.selected_periods)){
//       this.selected_periods.push($event);
//     }
//   };
//
//   updatePeriodModel(period) {
//     this.displayPerTree();
//     this.onPeriodUpdate.emit(period);
//   }
//
//   getPeriodsForAnalytics(selectedPeriod) {
//     let periodForAnalytics = "";
//     selectedPeriod.forEach((periodValue, periodIndex) => {
//       periodForAnalytics += periodIndex == 0 ? periodValue.id : ';' + periodValue.id;
//     });
//     return periodForAnalytics
//   }
//
//   // check if orgunit already exist in the orgunit display list
//   checkPeriodAvailabilty(period, array): boolean{
//     let checker = false;
//     for( let per of array ){
//       if( per.id == period.id){
//         checker =true;
//       }
//     }
//     return checker;
//   }
//
//   resetSelection(){
//     this.period_type = "";
//     this.selected_periods = [];
//     this.periods = [];
//   }
//
//   getPeriodArray(type,year){
//     let periods = [];
//     if(type == "Weekly"){
//       periods.push({id:'',name:''})
//     } else if(type == "Monthly"){
//       const monthName = ['January','February','March','April','May','June','July','August','September','October','November','December'];
//       const newPeriods = [];
//       const currentMonth = this.currentMonth - 1;
//       for (let x = 11 + currentMonth; x >= currentMonth; x--) {
//         const monthIndex: number = (x - currentMonth);
//         newPeriods.push({
//           id: (monthIndex <= currentMonth ? year : year-1) + (monthIndex < 9 ? '0' + (monthIndex + 1) : monthIndex + 1).toString(),
//           name: monthName[monthIndex] + ' ' + (monthIndex <= currentMonth ? year : year-1)
//         })
//       }
//
//       let sortIndex: number = 0;
//       for (let y = currentMonth; y <= 11 + currentMonth; y++) {
//         const monthIndex = y-sortIndex;
//         periods.unshift(newPeriods[monthIndex < 0 ? monthIndex + 12 : monthIndex]);
//         sortIndex += 2;
//       }
//     } else if(type == "BiMonthly"){
//       periods.push({id:year+'01B',name:'January - February '+year,selected:true},{id:year+'02B',name:'March - April '+year},{id:year+'03B',name:'May - June '+year},{id:year+'04B',name:'July - August '+year},{id:year+'05B',name:'September - October '+year},{id:year+'06B',name:'November - December '+year})
//     }else if(type == "Quarterly"){
//       year--;
//       let quarterIterator = 3;
//       const newPeriods = [];
//       const quarterNames = ['October - December', 'July - September', 'April - June', 'January - March'];
//       if (quarterIterator !== 0) {
//         for (let i = 0; i <= quarterIterator; i++) {
//           newPeriods.push({
//             id: (i > 1 ? (year + 1) : year) + 'Q' + (quarterIterator - i + 1),
//             name: quarterNames[i] + ' ' + (i > 1 ? (year + 1) : year)
//           })
//         }
//       }
//       periods.push(newPeriods[2],newPeriods[3], newPeriods[0], newPeriods[1])
//     }else if(type == "SixMonthly"){
//       periods.push({id:year+'S1',name:'January - June '+year,selected:true},{id:year+'S2',name:'July - December '+year})
//     }else if(type == "SixMonthlyApril"){
//       let useYear = parseInt(year) + 1;
//       periods.push({id:year+'AprilS2',name:'October '+year+' - March '+useYear,selected:true},{id:year+'AprilS1',name:'April - September '+year})
//     }else if(type == "FinancialOct"){
//       for (var i = 0; i <= 10; i++) {
//         let useYear = parseInt(year) - i;
//         let currentYear = useYear + 1;
//         periods.push({id:useYear+'Oct',name:'October '+useYear+' - September '+ currentYear})
//       }
//     }else if(type == "Yearly"){
//       for (var i = 0; i <= 10; i++) {
//         let useYear = parseInt(year) - i;
//         periods.push({id:useYear,name:useYear})
//
//       }
//     }else if(type == "FinancialJuly") {
//       for (var i = 1; i <= 4; i++) {
//         let useYear = parseInt(year) - i;
//         let currentYear = useYear + 1;
//         periods.push({id:useYear+'July',name:'July '+useYear+' - June '+ currentYear})
//       }
//     } else if(type == "FinancialApril"){
//       for (var i = 0; i <= 10; i++) {
//         let useYear = parseInt(year) - i;
//         let currentYear = useYear + 1;
//         periods.push({ id:useYear+'April',name:'April '+useYear+' - March '+ currentYear })
//       }
//     }else if(type == "Relative Weeks"){
//       periods.push({id:'THIS_WEEK',name:'This Week'},{id:'LAST_WEEK',name:'Last Week'},{id:'LAST_4_WEEK',name:'Last 4 Weeks',selected:true},{id:'LAST_12_WEEK',name:'last 12 Weeks'},{id:'LAST_52_WEEK',name:'Last 52 weeks'});
//     }else if(type == "Relative Month"){
//       periods.push({id:'THIS_MONTH',name:'This Month'},{id:'LAST_MONTH',name:'Last Month'},{id:'LAST_3_MONTHS',name:'Last 3 Month'},{id:'LAST_6_MONTHS',name:'Last 6 Month'},{id:'LAST_12_MONTHS',name:'Last 12 Month',selected:true});
//     }else if(type == "Relative Bi-Month"){
//       periods.push({id:'THIS_BIMONTH',name:'This Bi-month'},{id:'LAST_BIMONTH',name:'Last Bi-month'},{id:'LAST_6_BIMONTHS',name:'Last 6 bi-month',selected:true});
//     }else if(type == "Relative Quarter"){
//       periods.push({id:'THIS_QUARTER',name:'This Quarter'},{id:'LAST_QUARTER',name:'Last Quarter'},{id:'LAST_4_QUARTERS',name:'Last 4 Quarters',selected:true});
//     }else if(type == "Relative Six Monthly"){
//       periods.push({id:'THIS_SIX_MONTH',name:'This Six-month'},{id:'LAST_SIX_MONTH',name:'Last Six-month'},{id:'LAST_2_SIXMONTHS',name:'Last 2 Six-month',selected:true});
//     }else if(type == "Relative Year"){
//       periods.push({id:'THIS_FINANCIAL_YEAR',name:'This Year'},{id:'LAST_FINANCIAL_YEAR',name:'Last Year',selected:true},{id:'LAST_5_FINANCIAL_YEARS',name:'Last 5 Years'});
//     }else if(type == "Relative Financial Year"){
//       periods.push({id:'THIS_YEAR',name:'This Financial Year'},{id:'LAST_YEAR',name:'Last Financial Year',selected:true},{id:'LAST_5_YEARS',name:'Last 5 Five financial years'});
//     }
//
//     if(periods.length > 0 && this.selectedPeriodId === '0') {
//       this.selectedPeriodId = periods[0].id
//     }
//     return periods;
//   }
//
//   getLastPeriod(period: any, period_type:string ="Quarterly" ):any{
//     if(period_type == "Weekly"){
//
//     }
//     else if(period_type == "Monthly"){
//       let year = period.substring(0,4);
//       let month = period.substring(4,6);
//       let time = "";
//       if(month == "02"){
//         time = year+"01";
//       }else if(month == "03"){
//         time = year+"02";
//       }else if(month == "04"){
//         time = year+"03";
//       }else if(month == "05"){
//         time = year+"04";
//       }else if(month == "06"){
//         time = year+"05";
//       }else if(month == "07"){
//         time = year+"06";
//       }else if(month == "08"){
//         time = year+"07";
//       }else if(month == "09"){
//         time = year+"08";
//       }else if(month == "10"){
//         time = year+"09";
//       }else if(month == "11"){
//         time = year+"10";
//       }else if(month == "12"){
//         time = year+"11";
//       }else if(month == "01"){
//         let yr = parseInt(year)-1;
//         time = yr+"12";
//       }
//       return time;
//     }
//     else if(period_type == "BiMonthly"){
//       let year = period.substring(0,4);
//       let month = period.substring(4,6);
//       let time = "";
//       if(month == "02"){
//         time = year+"01B";
//       }else if(month == "03"){
//         time = year+"02B";
//       }else if(month == "04"){
//         time = year+"03B";
//       }else if(month == "05"){
//         time = year+"04B";
//       }else if(month == "06"){
//         time = year+"05B";
//       }else if(month == "01"){
//         let yr = parseInt(year)-1;
//         time = yr+"06B";
//       }
//       return time;
//     }
//     else if(period_type == "Quarterly"){
//       let year = period.substring(0,4);
//       let quater = period.substring(4,6);
//       let time = "";
//       if(quater == "Q4"){
//         time = year+"Q3";
//       }else if(quater == "Q3"){
//         time = year+"Q2";
//       }else if(quater == "Q2"){
//         time = year+"Q1";
//       }else if(quater == "Q1"){
//         let yr = parseInt(year)-1;
//         time = yr+"Q4";
//       }
//       return time;
//     }
//     else if(period_type == "SixMonthly"){
//       let year = period.substring(0,4);
//       let six_month = period.substring(4,6);
//       let time = "";
//       if(six_month == "S1"){
//         let yr = parseInt(year)-1;
//         time = yr+"S2";
//       }else if(six_month == "S2"){
//         time = year+"S1"
//       }
//       return time;
//     }
//     else if(period_type == "SixMonthlyApril"){
//       let year = period.substring(0,4);
//       let six_month = period.substring(4,12);
//       let time = "";
//       if(six_month == "AprilS2"){
//         time = year+"AprilS1"
//       }else if(six_month == "AprilS1"){
//         let yr = parseInt(year)-1;
//         time = yr+"AprilS2";
//       }
//       return time;
//     }
//     else if(period_type == "FinancialOct"){
//       let year = period.substring(0,4);
//       let last_year = parseInt(year) - 1;
//       return last_year+"Oct"
//     }
//     else if(period_type == "Yearly"){
//       return parseInt(period)-1;
//     }
//     else if(period_type == "FinancialJuly"){
//       let year = period.substring(0,4);
//       let last_year = parseInt(year) - 1;
//       return last_year+"July"
//     }
//     else if(period_type == "FinancialApril"){
//       let year = period.substring(0,4);
//       let last_year = parseInt(year) - 1;
//       return last_year+"April"
//     }
//
//
//   }
//
//   getNextPeriod(period: any, period_type:string ="Quarterly"):any{
//     if(period_type == "Weekly"){
//
//     }
//     else if(period_type == "Monthly"){
//       let year = period.substring(0,4);
//       let month = period.substring(4,6);
//       let time = "";
//       if(month == "02"){
//         time = year+"03";
//       }else if(month == "03"){
//         time = year+"04";
//       }else if(month == "04"){
//         time = year+"05";
//       }else if(month == "05"){
//         time = year+"06";
//       }else if(month == "06"){
//         time = year+"07";
//       }else if(month == "07"){
//         time = year+"08";
//       }else if(month == "08"){
//         time = year+"09";
//       }else if(month == "09"){
//         time = year+"10";
//       }else if(month == "10"){
//         time = year+"11";
//       }else if(month == "11"){
//         time = year+"12";
//       }else if(month == "12"){
//         let yr = parseInt(year)+1;
//         time = yr+"01";
//       }else if(month == "01"){
//         time = year+"02";
//       }
//       return time;
//     }
//     else if(period_type == "BiMonthly"){
//       let year = period.substring(0,4);
//       let month = period.substring(4,6);
//       let time = "";
//       if(month == "02"){
//         time = year+"03B";
//       }else if(month == "03"){
//         time = year+"04B";
//       }else if(month == "04"){
//         time = year+"05B";
//       }else if(month == "05"){
//         time = year+"06B";
//       }else if(month == "06"){
//         let yr = parseInt(year)+1;
//         time = yr+"01B";
//       }else if(month == "01"){
//         time = year+"02B";
//       }
//       return time;
//     }
//     else if(period_type == "Quarterly"){
//       let year = period.substring(0,4);
//       let quater = period.substring(4,6);
//       let time = "";
//       if(quater == "Q1"){
//         time = year+"Q2";
//       }else if(quater == "Q3"){
//         time = year+"Q4";
//       }else if(quater == "Q2"){
//         time = year+"Q3";
//       }else if(quater == "Q4"){
//         let yr = parseInt(year)+1;
//         time = yr+"Q1";
//       }
//       return time;
//     }
//     else if(period_type == "SixMonthly"){
//       let year = period.substring(0,4);
//       let six_month = period.substring(4,6);
//       let time = "";
//       if(six_month == "S2"){
//         let yr = parseInt(year)+1;
//         time = yr+"S1";
//       }else if(six_month == "S1"){
//         time = year+"S2"
//       }
//       return time;
//     }
//     else if(period_type == "SixMonthlyApril"){
//       let year = period.substring(0,4);
//       let six_month = period.substring(4,12);
//       let time = "";
//       if(six_month == "AprilS2"){
//         let yr = parseInt(year)+1;
//         time = yr+"AprilS1";
//       }else if(six_month == "AprilS1"){
//         time = year+"AprilS2"
//       }
//       return time;
//     }
//     else if(period_type == "FinancialOct"){
//       let year = period.substring(0,4);
//       let last_year = parseInt(year) + 1;
//       return last_year+"Oct"
//     }
//     else if(period_type == "Yearly"){
//       return parseInt(period)+1;
//     }
//     else if(period_type == "FinancialJuly"){
//       let year = period.substring(0,4);
//       let last_year = parseInt(year) + 1;
//       return last_year+"July"
//     }
//     else if(period_type == "FinancialApril"){
//       let year = period.substring(0,4);
//       let last_year = parseInt(year) + 1;
//       return last_year+"April"
//     }
//   }
//
//   onPeriodChange(periodId, periods) {
//     const period = periods.filter(period => {return period.id == periodId});
//     this.onPeriodUpdate.emit(period.length > 0 ? period[0]: {});
//   }
//
// }
