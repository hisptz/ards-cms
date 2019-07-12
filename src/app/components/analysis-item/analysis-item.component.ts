import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import sandSignika from 'highcharts/themes/sand-signika';

import { ExcelDownloadService } from '../../providers/excel-download.service';
sandSignika(Highcharts);
HighchartsMore(Highcharts);
// Highcharts(HighchartsExporting);

@Component({
  selector: 'analysis-item',
  templateUrl: './analysis-item.component.html',
  styleUrls: ['./analysis-item.component.css']
})
export class AnalysisItemComponent implements OnInit {
  @ViewChild('dataTable')
  dataTable: ElementRef;

  @Input() analyticsPayload;
  @Input() analysisGroup;
  @Input() reportDisplay;
  @Input() reportTableContent;
  @Input() selectedCategory;

  @Input() routerParams: any;
  isError = false;
  errorMessage: string = '';
  chartType;
  currentChart;
  combinedChart;

  constructor(private excelDownload: ExcelDownloadService) {}

  ngOnInit() {
    _.get(this.analyticsPayload, `metaData.dimensions[dx]`);
  }

  download() {
    const fileName = `${this.analysisGroup}-${this.reportTableContent.name}`;
    const el = this.dataTable.nativeElement;
    if (el) {
      this.excelDownload.exportXLS(fileName, el.outerHTML);
    }
  }

  drawChart(chartType) {
    this.chartType = chartType;
    if (chartType == 'stacking') {
      chartType = 'column';
    } else if (chartType == 'spider') {
      chartType = 'line';
    } else {
      chartType;
    }
    // Prepare Categories
    const categoryList = _.map(
      _.get(
        this.analyticsPayload,
        `metaData.dimensions[${this.selectedCategory}]`
      ),
      categoryId => {
        return _.get(
          this.analyticsPayload,
          `metaData.items[${categoryId}][name]`
        );
      }
    );

    // Prepare Series
    const seriesDataList = _.map(
      _.get(this.analyticsPayload, `metaData.dimensions[dx]`),
      dataItemId => {
        return {
          name: _.get(
            this.analyticsPayload,
            `metaData.items[${dataItemId}][name]`
          ),
          pointPlacement: this.chartType == 'spider' ? 'between' : false,
          type: chartType,
          data: _.map(
            _.get(
              this.analyticsPayload,
              `metaData.dimensions[${this.selectedCategory}]`
            ),
            categoryItemId => {
              return _.toNumber(
                _.head(
                  _.compact(
                    _.map(this.analyticsPayload.rows, rowItems => {
                      return rowItems[0] == dataItemId &&
                        rowItems[1] == categoryItemId
                        ? _.last(rowItems)
                        : null;
                    })
                  )
                )
              );
            }
          )
        };
      }
    );
    var seriesList = [];
    if (chartType == 'pie') {
      seriesList = [
        {
          name: _.get(_.head(seriesDataList), 'name'),
          colorByPoint: true,
          data: _.map(categoryList, (categoryItem, index) => {
            return {
              name: categoryItem,
              y: _.get(_.head(seriesDataList), 'data')[index]
            };
          })
        }
      ];
    } else if (chartType == 'spline') {
      const columnCombine = _.map(seriesDataList, dataItem => {
        return {
          name: dataItem.name,
          type: 'column',
          pointPlacement: false,
          data: dataItem.data
        };
      });
      seriesList = _.concat(columnCombine, seriesDataList);
    } else {
      seriesList = seriesDataList;
    }

    if (this.reportDisplay.isChart) {
      this.currentChart = Highcharts.chart('chartContainer', {
        chart: {
          type: chartType,
          polar: this.chartType == 'spider' ? true : false
        },
        title: {
          text: `${this.analysisGroup}:${this.reportTableContent.name}`
        },
        pane: {
          startAngle: 0,
          endAngle: 360
        },
        xAxis: {
          categories: categoryList,
          title: {
            text: null
          },
          tickmarkPlacement: 'on',
          lineWidth: 0
        },
        yAxis: {
          title: {
            text: null
          }
        },
        plotOptions: {
          [chartType]: {
            [this.chartType]: 'normal',
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true
            },
            showInLegend: true
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          x: -40,
          y: 20,
          floating: true,
          borderWidth: 1,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
          shadow: true
        },
        credits: {
          enabled: false
        },
        series: seriesList
      });

      if (chartType == 'spline') {
        this.combinedChart = Highcharts.chart('chartContainer', {
          title: {
            text: `${this.analysisGroup}:${this.reportTableContent.name}`
          },
          xAxis: {
            categories: categoryList
          },
          yAxis: [
            {
              title: {
                text: null
              }
            },
            {
              title: {
                text: null
              }
            }
          ],
          legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 20,
            floating: true,
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor ||
              'rgba(255,255,255,0.25)' // theme
          },
          labels: {
            items: [
              {
                style: {
                  left: '50px',
                  top: '18px',
                  color:
                    Highcharts.defaultOptions.legend.backgroundColor ||
                    '#000000'
                }
              }
            ]
          },
          series: seriesList
        });
      }
    }
  }
}
