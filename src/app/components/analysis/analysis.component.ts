import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ReportTableService } from '../../providers/report-table.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'jqueryui';
import * as _ from 'lodash';
// import { multiselect } from "../../../scripts/jquery-ui-multiselect/src/jquery.multiselect.js";
import { Observable } from 'rxjs';

declare let jQuery: any;
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements AfterViewInit {
  reportTableContent: any;
  monthList = '';
  yearlist = '';
  quarterList = '';
  routerParams: any = null;
  isError = false;
  errorMessage: string = '';
  constructor(
    private reportTable: ReportTableService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.preparePeriodFilter('2016');
  }

  ngAfterViewInit() {
    this.reportTable.getReportTables().subscribe(reportTable => {
      this.route.params.subscribe(params => {
        const reportTableGroup = _.find(reportTable, {
          id: params.analysisGroup
        });
        this.reportTableContent = _.find(reportTable, {
          id: params.analysisGroup
        });
      });
    });
  }

  selectYears(event?) {
    $('.periodfilter button')
      .removeClass('btn-success')
      .addClass('btn-default');
    $(this)
      .removeClass('btn-default')
      .addClass('btn-success');
    // .multiselectfilter("destroy");
    // $(".periods").multiselect("destroy");
    $('.periods').html(this.yearlist);
    // console.log($("categoryList"));
    // const attrib = $("periodSelect").multiselect();
    // .multiselectfilter();
    console.log();
  }
  selectQuaters(event) {
    $('.periodfilter button')
      .removeClass('btn-success')
      .addClass('btn-default');
    $(this)
      .removeClass('btn-default')
      .addClass('btn-success');
    // $(".periods").multiselectfilter("destroy");
    // $(".periods").multiselect("destroy");
    $('.periods').html(this.quarterList);
    // $(".periods")
    //   .multiselect()
    //   .multiselectfilter();
  }
  selectMonths(event) {
    $('.periodfilter button')
      .removeClass('btn-success')
      .addClass('btn-default');
    $(this)
      .removeClass('btn-default')
      .addClass('btn-success');
    // $(".periods").multiselectfilter("destroy");
    // $(".periods").multiselect("destroy");
    $('.periods').html(this.monthList);
    // $(".periods")
    //   .multiselect()
    //   .multiselectfilter();
  }
  preparePeriodFilter(first_period) {
    var currentYear = new Date().getFullYear();
    for (var i = 0; i < 10; i++) {
      //defining years
      var year = currentYear - i;
      var year1 = currentYear - (i + 1);
      var financial = 'july ' + year1 + ' june ' + year;
      if ($.inArray(year1 + 'July', first_period) == -1) {
        this.yearlist +=
          '<option value="' + year1 + 'July">' + financial + '</option>';
      } else {
        this.yearlist +=
          '<option value="' +
          year1 +
          'July" selected="selected">' +
          financial +
          '</option>';
      }

      //defining quarters
      if ($.inArray(year + 'Q1', first_period) != -1) {
        this.quarterList +=
          '<option value="' +
          year +
          'Q1" selected="selected">Jan to Mar ' +
          year +
          '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q2">Apr to Jun ' + year + '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q3">Jul to Sep ' + year + '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q4">Oct to Dec ' + year + '</option>';
      } else if ($.inArray(year + 'Q2', first_period) != -1) {
        this.quarterList +=
          '<option value="' + year + 'Q1">Jan to Mar ' + year + '</option>';
        this.quarterList +=
          '<option value="' +
          year +
          'Q2" selected="selected">Apr to Jun ' +
          year +
          '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q3">Jul to Sep ' + year + '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q4">Oct to Dec ' + year + '</option>';
      } else if ($.inArray(year + 'Q3', first_period) != -1) {
        this.quarterList +=
          '<option value="' + year + 'Q1">Jan to Mar ' + year + '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q2">Apr to Jun ' + year + '</option>';
        this.quarterList +=
          '<option value="' +
          year +
          'Q3" selected="selected">Jul to Sep ' +
          year +
          '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q4">Oct to Dec ' + year + '</option>';
      } else if ($.inArray(year + 'Q4', first_period) != -1) {
        this.quarterList +=
          '<option value="' + year + 'Q1">Jan to Mar ' + year + '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q2">Apr to Jun ' + year + '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q3">Jul to Sep ' + year + '</option>';
        this.quarterList +=
          '<option value="' +
          year +
          'Q4" selected="selected">Oct to Dec ' +
          year +
          '</option>';
      } else {
        this.quarterList +=
          '<option value="' + year + 'Q1">Jan to Mar ' + year + '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q2">Apr to Jun ' + year + '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q3">Jul to Sep ' + year + '</option>';
        this.quarterList +=
          '<option value="' + year + 'Q4">Oct to Dec ' + year + '</option>';
      }

      //defining months
      if ($.inArray(year + '01', first_period) != -1) {
        this.monthList +=
          '<option value="' +
          year +
          '01" selected="selected">January ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '02', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '02" selected="selected">February ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '03', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '03" selected="selected">March ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '04', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '04" selected="selected">April ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '05', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '05" selected="selected">May ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '06', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '06" selected="selected">June ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '07', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '07" selected="selected">July ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '08', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '08" selected="selected">August ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '09', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '09" selected="selected">September ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '10', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '10" selected="selected">October ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '11', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '11" selected="selected">November ' +
          year +
          '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      } else if ($.inArray(year + '12', first_period) != -1) {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' +
          year +
          '12" selected="selected">December ' +
          year +
          '</option>';
      } else {
        this.monthList +=
          '<option value="' + year + '01">January ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '02">February ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '03">March ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '04">April ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '05">May ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '06">June ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '07">July ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '08">August ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '09">September ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '10">October ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '11">November ' + year + '</option>';
        this.monthList +=
          '<option value="' + year + '12">December ' + year + '</option>';
      }
    }
    $('.periods').css('width', '180px');
    $('#years').trigger('click');
    this.selectYears();
  }
}
