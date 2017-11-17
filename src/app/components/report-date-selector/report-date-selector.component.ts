// import {
//   Component, OnInit, Output, EventEmitter, OnChanges, AfterViewChecked, AfterViewInit,
//   ViewChild
// } from '@angular/core';
// import {IMyOptions} from "mydatepicker";
// import {TreeComponent} from "angular-tree-component/dist/components/tree.component";
//
// @Component({
//   selector: 'app-report-date-selector',
//   templateUrl: './report-date-selector.component.html',
//   styleUrls: ['./report-date-selector.component.css']
// })
// export class ReportDateSelectorComponent implements OnInit, AfterViewInit {
//
//   public myDatePickerOptions: IMyOptions = {
//     // other options...
//     dateFormat: ' dd mmm yyyy',
//   };
//
//   // Initialized to specific date (09.10.2018).
//   public todaysDate = new Date();
//   public dateModel: any = { date: { year: this.todaysDate.getFullYear(), month: this.todaysDate.getMonth() + 1, day: this.todaysDate.getDate() }, jsdate: this.todaysDate };
//   @Output() onDateModelChange: EventEmitter<any> = new EventEmitter<any>();
//   constructor() {
//   }
//
//   ngOnInit() {
//     setTimeout(() => {
//       this.onDateModelChange.emit(this.dateModel);
//     }, 20)
//   }
//
//   ngAfterViewInit() {
//
//   }
//
//   updateDate(date) {
//     this.onDateModelChange.emit(date);
//   }
//
// }
