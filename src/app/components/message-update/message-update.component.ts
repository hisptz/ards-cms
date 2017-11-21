import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-message-update',
  templateUrl: './message-update.component.html',
  styleUrls: ['./message-update.component.css']
})
export class MessageUpdateComponent implements OnInit {
  @Input() menuList: any;
  @Input() actionLoadingMessage: string;
  @Input() actionLoading: boolean;
  @Input() actionError: boolean;
  @Output() editHomeMenuEvent = new EventEmitter;
  @Output() deleteHomeMenuEvent = new EventEmitter;

  constructor() {
  }

  ngOnInit() {
  }

}
