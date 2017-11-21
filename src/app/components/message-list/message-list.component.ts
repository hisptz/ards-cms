import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  @Input() messageList: any;
  @Input() actionLoadingMessage: string;
  @Input() actionLoading: boolean;
  @Input() actionError: boolean;
  @Output() editMessageEvent = new EventEmitter;
  @Output() deleteMessageEvent = new EventEmitter;
  @Output() toggleHideShowMessageEvent = new EventEmitter;

  constructor() {
  }

  ngOnInit() {
  }


  toggleMessage(message) {
    message.hidden = !message.hidden;
    this.toggleHideShowMessageEvent.emit(message);
  }

  editMessage(message) {
    this.editMessageEvent.emit(message);
  }

  deleteMessage(message) {
    this.deleteMessageEvent.emit(message);
  }

}
