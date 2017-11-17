import {
  Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import * as _ from 'lodash';
import {Observable} from "rxjs";
@Component({
  selector: 'app-dataset-selector',
  templateUrl: './dataset-selector.component.html',
  styleUrls: ['./dataset-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatasetSelectorComponent implements OnInit {

  @Input() assignedDatasets$: Observable<any>;
  assignedDatasets: any[] = [];
  selectedDataset: string = '';
  @Output() onDatasetSelect: EventEmitter<string> = new EventEmitter<string>();
  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.assignedDatasets$.subscribe(assignedDatasets => {
      this.assignedDatasets = assignedDatasets;
      if(this.assignedDatasets.length > 0) {
        if(this.selectedDataset === '' || (this.selectedDataset !== '' && !_.find(this.assignedDatasets, ['id', this.selectedDataset]))) {
          this.selectedDataset = this.assignedDatasets[0].id;
        }
        this.getSelectedDataset(this.selectedDataset);
      }
      this.ref.markForCheck();
    })
  }

  getSelectedDataset(id) {
    this.onDatasetSelect.emit(_.find(this.assignedDatasets, ['id', id]));
  }

}
