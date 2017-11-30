import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {SharingService} from "../../providers/sharing.service";
@Component({
  selector: 'app-info-sharing-list',
  templateUrl: './info-sharing-list.component.html',
  styleUrls: ['./info-sharing-list.component.css']
})
export class InfoSharingListComponent implements OnInit {
  @Input() infoSharings: any;
  @Output() updateSharingEvent = new EventEmitter;
  @Output() editSharingEvent = new EventEmitter;

  constructor(private sharingService: SharingService) {
  }

  ngOnInit() {
  }

  openSharing(sharing) {
    this.infoSharings.forEach(shares => {
      shares.id === sharing.id ? shares.show = shares.show : shares.show = false;
    })
    this.infoSharings[sharing.id].show = !this.infoSharings[sharing.id].show;
  }

  editSharing(sharing) {
    this.editSharingEvent.emit(sharing);
  }

  deleteSharing(infoSharing) {

    let newSharings = [];
    this.infoSharings.filter(sharing => {
      if (sharing.id === infoSharing.id)
      {
      } else {
        newSharings.push(sharing);
      }

    });

    this.sharingService.saveSharing(newSharings).subscribe(response=>{
      this.updateSharingEvent.emit({load:true});
    })

  }

}
