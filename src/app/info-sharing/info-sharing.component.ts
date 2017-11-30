import {Component, OnInit} from '@angular/core';
import {SharingService} from "../providers/sharing.service";

@Component({
  selector: 'app-info-sharing',
  templateUrl: './info-sharing.component.html',
  styleUrls: ['./info-sharing.component.css']
})
export class InfoSharingComponent implements OnInit {

  infoSharings: any;
  actionLoading = true;
  actionLoadingMessage = "Loading information sharing, please wait ...";
  showAddSharingForm = false;
  showEditSharingForm = false;
  updatedSharing: any;

  constructor(private sharingService: SharingService) {
    this.loadInformationSharing();
  }

  ngOnInit() {
  }

  refineSharing(sharing) {
    let sharings = []
    sharing.forEach((share, index) => {
      share['id'] = index;
      share['show'] = index == 0 ? true : false;
      sharings.push(share);
    })

    return sharings;
  }

  addNewSharing() {
    this.showAddSharingForm = true;
  }

  onEditSharingEvent(sharing) {
    this.showEditSharingForm = true;
    this.updatedSharing = sharing;
  }

  onAddSharingEvent(sharing) {
    this.showAddSharingForm = false;
    this.actionLoading = true;
    this.actionLoadingMessage = "Adding information sharing, please wait ...";
    this.loadInformationSharing();
  }

  onCancelSharingEvent($event) {
    this.showAddSharingForm = false;
  }

  loadInformationSharing() {
    this.sharingService.getSharing().subscribe(sharings => {
      this.infoSharings = this.refineSharing(sharings);
      this.actionLoading = false;
    });
  }

  onUpdateSharingEvent($event) {
    this.showEditSharingForm = false;
    if ($event && $event.load) {
      this.actionLoading = true;
      this.loadInformationSharing();
    }

  }

}
