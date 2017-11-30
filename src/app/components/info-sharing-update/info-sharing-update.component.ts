import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SharingService} from "../../providers/sharing.service";
import * as _ from 'lodash';
@Component({
  selector: 'app-info-sharing-update',
  templateUrl: './info-sharing-update.component.html',
  styleUrls: ['./info-sharing-update.component.css']
})
export class InfoSharingUpdateComponent implements OnInit {
  @Input() infoSharings;
  @Input() updatedSharing;
  id: any;
  title: any;
  ckeditorContent: any;
  loading = false;
  @Output() updateSharingEvent = new EventEmitter;
  @Output() cancelEditSharingEvent = new EventEmitter;

  constructor(private sharingService: SharingService) {
  }

  ngOnInit() {
    this.id = this.updatedSharing.id;
    this.title = this.updatedSharing.title;
    this.ckeditorContent = this.updatedSharing.body;
  }

  updatedInfoSharing(infoSharing) {
    this.loading = true;
    const infoSharings = _.clone(this.infoSharings);
    const newSharings = [];
    infoSharings.forEach(sharing => {
      if (sharing.id === infoSharing.id) {
        newSharings.push(infoSharing);
      } else {
        newSharings.push(sharing);
      }

    });

    this.sharingService.saveSharing(newSharings).subscribe(response => {
      this.updateSharingEvent.emit({load: true});
    })
  }

  toggleEditForm() {
    this.cancelEditSharingEvent.emit();
  }

}
