import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from '../../providers/message.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-message-update',
  templateUrl: './message-update.component.html',
  styleUrls: ['./message-update.component.css']
})
export class MessageUpdateComponent implements OnInit {
  loading: any;
  @Output() toggleEditMessageFormEvent = new EventEmitter();
  @Output() editMessageFormEvent = new EventEmitter();
  @Input() messageId: any;
  @Input() messageTitle: any;
  @Input() ckeditorContent: any;
  @Input() messageList: any;

  constructor(private messageService: MessageService) {}

  ngOnInit() {}

  updateMessage(message) {
    this.loading = true;
    let newMessageList = _.map([...this.messageList], messageItem => {
      return messageItem.id === message.id ? message : messageItem;
    });

    this.messageService
      .saveMessage(this.refineMessageList(newMessageList))
      .subscribe(response => {
        this.toggleEditMessageFormEvent.emit({ load: true });
      });
  }

  toggleEditForm() {
    this.toggleEditMessageFormEvent.emit();
  }

  refineMessageList(messageListClone) {
    let messageObject = {};

    _.map(messageListClone, messageItem => {
      if (messageItem.id === 1) {
        messageObject['messageOne'] = messageItem;
      }
      if (messageItem.id === 2) {
        messageObject['messageTwo'] = messageItem;
      }
    });
    return messageObject;
  }
}
