import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ReportTableService } from '../../providers/report-table.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'jqueryui';
import * as _ from 'lodash';
// import { multiselect } from "../../../scripts/jquery-ui-multiselect/src/jquery.multiselect.js";
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import { AnalysisItemComponent } from '../analysis-item/analysis-item.component';

declare let jQuery: any;
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent {
  @ViewChild('analysisItem') analysisItem: AnalysisItemComponent;

  analytics$: Observable<any>;
  reportTableContent: any;
  analysisGroup;
  monthList = '';
  yearlist = '';
  quarterList = '';
  routerParams: any = null;
  isError = false;
  reportTableData;
  selectedCategory = 'pe';
  reportDisplay = {
    name: 'Table',
    id: 'draw_table',
    img: 'assets/img/table.png',
    type: 'table'
  };
  errorMessage: string = '';
  reportTypes = [
    {
      name: 'Table',
      id: 'draw_table',
      img: 'assets/img/table.png',
      type: 'table'
    },
    {
      name: 'Bar Chart',
      id: 'draw_bar',
      img: 'assets/img/column.png',
      type: 'bar',
      isChart: 'True'
    },
    {
      name: 'Column Chart',
      id: 'draw_table',
      img: 'assets/img/bar.png',
      type: 'column',
      isChart: 'True'
    },
    {
      name: 'Line Chart',
      id: 'draw_line',
      img: 'assets/img/line.png',
      type: 'line',
      isChart: 'True'
    },
    {
      name: 'Pie Chart',
      id: 'draw_pie',
      img: 'assets/img/pie.png',
      type: 'pie',
      isChart: 'True'
    },
    {
      name: 'Stacked Chart',
      id: 'draw_stacked',
      img: 'assets/img/staked.jpg',
      type: 'stacking',
      isChart: 'True'
    },
    {
      name: 'Spider Chart',
      id: 'draw_spider',
      img: 'assets/img/spider.jpg',
      type: 'spider',
      isChart: 'True'
    },
    {
      name: 'Combined Chart',
      id: 'draw_combined',
      img: 'assets/img/combined.jpg',
      type: 'spline',
      isChart: 'True'
    },
    {
      name: 'Export to Excel',
      id: 'export_csv',
      img: 'assets/img/cvs.jpg',
      isAction: 'True'
    }
  ];
  constructor(
    private reportTable: ReportTableService,
    private router: Router,
    private route: ActivatedRoute,
    private http: Http
  ) {
    this.preparePeriodFilter('2019');
  }
  ngOnInit() {
    this.getReport();
  }

  getReport() {
    this.reportTable.getReportTables().subscribe(reportTable => {
      this.route.params.subscribe(params => {
        this.analysisGroup = _.get(
          _.find(reportTable, {
            id: params.analysisGroup
          }),
          'name'
        );
        this.reportTableContent = _.find(
          _.get(
            _.find(reportTable, {
              id: params.analysisGroup
            }),
            'children'
          ),
          {
            id: params.analysisItemId
          }
        );
        {
          if (
            !this.reportTableContent.detailsForAnalytics.ou ||
            !this.reportTableContent.detailsForAnalytics.dx ||
            !this.reportTableContent.detailsForAnalytics.pe
          ) {
            $('.alert').fadeIn('slow');
            setTimeout(function() {
              $('.alert').fadeOut('slow');
            }, 3000);
          } else {
            var data_dimension = `dimension=dx:${
              this.reportTableContent.detailsForAnalytics.dx
            }`;
            this.selectedCategory = $('select[name=category]').val();
            //creating column dimension
            var column_dimension = 'dimension=' + this.selectedCategory + ':';
            //if column will be administrative units
            this.selectedCategory == 'ou'
              ? (column_dimension += this.reportTableContent.detailsForAnalytics
                  .ou)
              : (column_dimension += this.reportTableContent.detailsForAnalytics
                  .pe);
            //creating filter dimensions
            var filter =
              this.selectedCategory != 'ou'
                ? `filter=ou:${this.reportTableContent.detailsForAnalytics.ou}`
                : `filter=pe:${this.reportTableContent.detailsForAnalytics.pe}`;
            var url =
              '../../../api/analytics.json?' +
              data_dimension +
              '&' +
              column_dimension +
              '&' +
              filter;
          }
          this.analytics$ = this.run(url);
          this.toggleReportType(this.reportDisplay);
        }
      });
    });
  }
  run(url) {
    return Observable.create(obs => {
      this.http
        .get(url)
        .map((res: Response) => res.json())
        .catch(error => Observable.throw(new Error(error)))
        .subscribe(analytics => {
          obs.next(analytics);
          obs.complete();
        });
    });
  }

  toggleReportType(currentReportMode) {
    this.reportDisplay = currentReportMode;
    setTimeout(() => {
      if (currentReportMode.isAction) {
        this.analysisItem.download();
      } else {
        this.analysisItem.drawChart(currentReportMode.type);
      }
    }, 200);
  }

  onChangeCategory(event) {
    this.selectedCategory = event;
    this.getReport();
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
    $('.periods');
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
