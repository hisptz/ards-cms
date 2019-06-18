import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import * as HighchartsExporting from 'highcharts/modules/exporting';
import sandSignika from 'highcharts/themes/sand-signika';
sandSignika(Highcharts);
// Highcharts(HighchartsExporting);

@Component({
  selector: 'analysis-item',
  templateUrl: './analysis-item.component.html',
  styleUrls: ['./analysis-item.component.css']
})
export class AnalysisItemComponent implements OnInit {
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

  constructor() {}

  ngOnInit() {}
  drawChart(chartType) {
    this.chartType = chartType;
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
    const seriesList =
      chartType != 'pie'
        ? seriesDataList
        : [
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

    if (this.reportDisplay.isChart) {
      this.currentChart = Highcharts.chart('chartContainer', {
        chart: {
          type: chartType
        },
        title: {
          text: `${this.analysisGroup}:${this.reportTableContent.name}`
        },
        xAxis: {
          categories: categoryList,
          title: {
            text: null
          }
        },
        yAxis: {
          title: {
            text: null
          }
        },
        plotOptions: {
          [chartType]: {
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
          verticalAlign: 'top',
          x: -40,
          y: 100,
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
    }
  }
}
