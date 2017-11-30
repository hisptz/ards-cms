import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SharingService} from "../../providers/sharing.service";

@Component({
  selector: 'app-info-sharing-add',
  templateUrl: './info-sharing-add.component.html',
  styleUrls: ['./info-sharing-add.component.css']
})
export class InfoSharingAddComponent implements OnInit {
  @Input() infoSharings;
  title: any;
  ckeditorContent: any;
  loading = false;
  @Output() addSharingEvent = new EventEmitter;
  @Output() cancelSharingEvent = new EventEmitter;

  constructor(private sharingService: SharingService) {
  }

  ngOnInit() {
  }

  createInfoSharing(infoSharing) {
    this.loading = true;
    this.infoSharings.push(infoSharing);
    this.sharingService.saveSharing(this.infoSharings).subscribe(response => {
      this.addSharingEvent.emit(infoSharing);
      this.loading = false;
    })

  }

  toggleAddForm() {
    this.cancelSharingEvent.emit();
  }
}
