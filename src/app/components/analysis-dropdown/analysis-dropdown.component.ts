import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportTableService } from '../../providers/report-table.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
@Component({
  selector: 'analysis-dropdown',
  templateUrl: './analysis-dropdown.component.html',
  styleUrls: ['./analysis-dropdown.component.css']
})
export class AnalysisDropdownComponent {
  reportTableContent: any;
  @Input() activeFilter;
  @Input() displayingPeriod;
  @Input() displayingOrgUnits;
  @Input() analyticsPayload;
  @Input() displayingData;
  @Output() periodSelection = new EventEmitter();
  @Output() orgUnitSelection = new EventEmitter();
  @Output() dataSelection = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onItemClick(event, selectItem, displayingData) {
    selectItem.selected = event.target.checked;

    if (this.activeFilter == 'pe') {
      _.map(displayingData, listItem => {
        return listItem.id == selectItem.id ? selectItem : listItem;
      });
      this.periodSelection.emit(displayingData);
    } else if (this.activeFilter == 'ou') {
      _.map(displayingData, listItem => {
        return listItem.id == selectItem.id ? selectItem : listItem;
      });
      this.orgUnitSelection.emit(displayingData);
    } else if (this.activeFilter == 'dx') {
      _.map(displayingData, listItem => {
        return listItem.id == selectItem.id ? selectItem : listItem;
      });
      this.dataSelection.emit(displayingData);
    }
  }
}
