import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ReportTableService } from '../../providers/report-table.service';
import { OrganisationUnitService } from '../../providers/organisation-unit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getQuarter } from 'date-fns';
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
  displayingPeriod;
  displayingOrgUnits;
  displayingData;
  currentPeriodSelections = [];
  currentOrgunitsSelections = [];
  currentDataSelections = [];
  monthList = [];
  yearlist = [];
  quarterList = [];
  district = [];
  regions = [];
  allOrgUnits = [];
  showSelectionError = false;
  showPeriodSelector = false;
  showOrgUnitSelector = false;
  showDataSelector = false;
  routerParams: any = null;
  isError = false;
  reportTableData;
  selectedCategory = 'pe';
  currentUrl;
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
      id: 'draw_column',
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
    private orgunitservice: OrganisationUnitService,
    private reportTable: ReportTableService,
    private router: Router,
    private route: ActivatedRoute,
    private http: Http
  ) {
    this.prepareOrgUnitFilter();
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
            this.currentDataSelections =
              _.intersection(
                _.split(this.reportTableContent.detailsForAnalytics.dx, ';'),
                _.map(this.displayingData, 'id')
              ).length > 0
                ? _.map(this.currentDataSelections, 'id')
                : _.split(this.reportTableContent.detailsForAnalytics.dx, ';');
            // console.log(this.currentDataSelections);
            // ========================================================================================================================================================

            this.currentPeriodSelections =
              _.intersection(
                _.split(this.reportTableContent.detailsForAnalytics.dx, ';'),
                _.map(this.displayingData, 'id')
              ).length > 0
                ? _.map(this.currentPeriodSelections, 'id')
                : _.split(this.reportTableContent.detailsForAnalytics.pe, ';');
            // console.log(this.currentPeriodSelections);

            // ========================================================================================================================================================

            this.currentOrgunitsSelections =
              _.intersection(
                _.split(this.reportTableContent.detailsForAnalytics.dx, ';'),
                _.map(this.displayingData, 'id')
              ).length > 0
                ? _.map(this.currentOrgunitsSelections, 'id')
                : _.split(this.reportTableContent.detailsForAnalytics.ou, ';');

            var data_dimension = `dimension=dx:${_.join(
              this.currentDataSelections,
              ';'
            )}`;
            this.selectedCategory = $('select[name=category]').val();
            //creating column dimension
            var column_dimension = 'dimension=' + this.selectedCategory + ':';
            //if column will be administrative units
            this.selectedCategory == 'ou'
              ? (column_dimension += _.join(
                  this.currentOrgunitsSelections,
                  ';'
                ))
              : (column_dimension += _.join(this.currentPeriodSelections, ';'));
            //creating filter dimensions
            var filter =
              this.selectedCategory != 'ou'
                ? `filter=ou:${_.join(this.currentOrgunitsSelections, ';')}`
                : `filter=pe:${_.join(this.currentPeriodSelections, ';')}`;
            var url =
              '../../../api/analytics.json?' +
              data_dimension +
              '&' +
              column_dimension +
              '&' +
              filter;
          }
          this.currentUrl = url;
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
          const dxUIDs = _.get(analytics, 'metaData.dimensions[dx]');
          this.displayingData =
            this.displayingData &&
            _.intersection(dxUIDs, _.map(this.displayingData, 'id')).length > 0
              ? this.displayingData
              : _.map(dxUIDs, dxUID => {
                  return {
                    id: dxUID,
                    name: _.get(analytics, `metaData.items[${dxUID}][name]`),
                    selected: true
                  };
                });
          this.currentDataSelections = _.filter(this.displayingData, {
            selected: true
          });

          const ouUIDs = _.get(analytics, 'metaData.dimensions[ou]');
          this.displayingOrgUnits =
            _.toString(this.currentOrgunitsSelections).indexOf('USER') > -1 ||
            !this.displayingOrgUnits
              ? _.map(ouUIDs, ouUID => {
                  return {
                    id: ouUID,
                    selectionType: _.head(this.currentOrgunitsSelections),
                    name: _.get(analytics, `metaData.items[${ouUID}][name]`),
                    selected: true
                  };
                })
              : this.displayingOrgUnits;

          this.currentOrgunitsSelections = _.filter(this.displayingOrgUnits, {
            selected: true
          });

          const peUIDs = _.get(analytics, 'metaData.dimensions[pe]');
          const firstPeriodSelection = _.head(this.currentPeriodSelections);

          if (
            firstPeriodSelection &&
            (!firstPeriodSelection.id || !this.displayingPeriod)
          ) {
            if (
              firstPeriodSelection.indexOf('July') > 1 ||
              firstPeriodSelection.indexOf('YEARS') > 1
            ) {
              this.displayingPeriod = this.selectYears();
            } else if (firstPeriodSelection.indexOf('Q') > 1) {
              this.displayingPeriod = this.selectQuaters();
            } else if (firstPeriodSelection.length == 6) {
              this.displayingPeriod = this.selectMonths();
            }
            _.map(peUIDs, peUID => {
              _.set(
                _.find(
                  this.displayingPeriod,
                  _.matchesProperty(
                    'id',
                    peUID.length !== 4 ? peUID : `${peUID}July`
                  )
                ),
                'selected',
                true
              );
            });
          } else {
            this.displayingPeriod = this.displayingPeriod;
          }

          this.currentPeriodSelections = _.filter(this.displayingPeriod, {
            selected: true
          });
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
  selectYears(event?) {
    if (event) {
      this.showPeriodSelector = true;
      this.displayingPeriod = this.yearlist;
    }
    return this.yearlist;
  }
  selectQuaters(event?) {
    if (event) {
      this.showPeriodSelector = true;
      this.displayingPeriod = this.quarterList;
    }
    return this.quarterList;
  }
  selectMonths(event?) {
    if (event) {
      this.showPeriodSelector = true;
      this.displayingPeriod = this.monthList;
    }
    return this.monthList;
  }
  preparePeriodFilter(first_period) {
    var currentYear = new Date().getFullYear();
    const quaterDivision = [
      {
        shortname: 'Q4',
        months: 'Oct to Dec '
      },
      {
        shortname: 'Q3',
        months: 'Jul to Sep '
      },
      {
        shortname: 'Q2',
        months: 'Apr to Jun '
      },
      {
        shortname: 'Q1',
        months: 'Jan to Mar '
      }
    ];
    const monthDivision = [
      {
        shortname: '12',
        months: 'December '
      },
      {
        shortname: '11',
        months: 'November '
      },
      {
        shortname: '10',
        months: 'October '
      },
      {
        shortname: '09',
        months: 'September '
      },
      {
        shortname: '08',
        months: 'August '
      },
      {
        shortname: '07',
        months: 'July '
      },
      {
        shortname: '06',
        months: 'June '
      },
      {
        shortname: '05',
        months: 'May '
      },
      {
        shortname: '04',
        months: 'April '
      },
      {
        shortname: '03',
        months: 'March '
      },
      {
        shortname: '02',
        months: 'February '
      },
      {
        shortname: '01',
        months: 'January '
      }
    ];
    for (var i = 0; i < 10; i++) {
      //defining years
      var year = currentYear - i;
      var year1 = currentYear - (i + 1);
      var financial = 'july ' + year1 + ' june ' + year;

      this.yearlist.push({
        id: year + 'July',
        name: financial,
        selected: false
      });

      //defining quarters
      _.map(quaterDivision, quarter => {
        this.quarterList.push({
          id: year + quarter.shortname,
          name: quarter.months + year,
          selected: false
        });
      });

      //defining months
      _.map(monthDivision, month => {
        this.monthList.push({
          id: year + month.shortname,
          name: month.months + year,
          selected: false
        });
      });
    }
    $('.periods').css('width', '180px');
    $('#years').trigger('click');
    // this.selectYears();
  }

  prepareOrgUnitFilter() {
    this.orgunitservice.getOrgunits().subscribe(orgUnits => {
      this.allOrgUnits = orgUnits;
      this.regions = _.filter(orgUnits.organisationUnits, { level: 2 });
      this.district = _.filter(orgUnits.organisationUnits, { level: 3 });
    });
  }

  selectRegions(event?) {
    if (event) {
      this.displayingOrgUnits = this.regions;
      this.showOrgUnitSelector = true;
    }
  }

  selectDistricts(event?) {
    if (event) {
      this.displayingOrgUnits = this.district;
      this.showOrgUnitSelector = true;
    }
  }

  onChangedOrgUnit(event) {
    this.currentOrgunitsSelections = _.filter(event, { selected: true });
    if (this.currentOrgunitsSelections.length > 0) {
      this.getReport();
    } else {
      this.showSelectionError = true;
    }
  }
  onChangedPeriod(event) {
    this.currentPeriodSelections = _.filter(event, { selected: true });
    if (this.currentPeriodSelections.length > 0) {
      this.getReport();
    } else {
      this.showSelectionError = true;
    }
  }
  onChangeCategory(event) {
    this.selectedCategory = event;
    this.getReport();
  }
  onChangedData(event) {
    this.currentDataSelections = _.filter(event, { selected: true });
    if (this.currentDataSelections.length > 0) {
      this.getReport();
    } else {
      this.showSelectionError = true;
    }
  }
}
