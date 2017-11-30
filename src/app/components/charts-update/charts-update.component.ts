import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {IMultiSelectSettings, IMultiSelectTexts} from "angular-2-dropdown-multiselect";
import {ChartService} from "../../providers/chart.service";
import * as _ from 'lodash';
@Component({
  selector: 'app-charts-update',
  templateUrl: './charts-update.component.html',
  styleUrls: ['./charts-update.component.css']
})
export class ChartsUpdateComponent implements OnInit {
  charts = [];
  selectedCharts = [];
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'chart selected',
    checkedPlural: 'charts selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'No chart found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select Chart',
    allSelected: 'All selected',
  };

  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    containerClasses: 'chart-dropdown',
    itemClasses: 'item-style',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true,
    selectionLimit: 3,
    closeOnClickOutside: true
  };

  @Output() loadingChart = new EventEmitter;
  @Output() selectedChartUpdated = new EventEmitter;

  constructor(private chartService: ChartService) {

    this.getStoreCharts();
  }

  ngOnInit() {

  }

  onChange($event) {
    const newAdded = [];
    $event.forEach(chart => {
      const chartIndex = _.findIndex(this.charts, ['id', chart]);
      if (chartIndex >= 0) {
        newAdded.push(this.charts[chartIndex]);
      }
    })
    this.loadingChart.emit(true);
    this.chartService.updateStoreCharts(newAdded).subscribe(response => {
      this.selectedChartUpdated.emit({all: this.charts, selected: this.selectedCharts});
      this.loadingChart.emit(false);
    });
  }

  getStoreCharts() {
    this.loadingChart.emit(true);
    this.chartService.getSystemCharts().subscribe(systemCharts => {
      this.charts = systemCharts;
      this.chartService.getDataStoreCharts().subscribe(charts => {
        this.selectedCharts = charts;
        this.selectedChartUpdated.emit({all: this.charts, selected: this.selectedCharts});
        this.loadingChart.emit(false);
      })
    })

  }


}
