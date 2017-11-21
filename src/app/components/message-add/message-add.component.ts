import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageService} from "../../providers/message.service";
import * as _ from 'lodash';
@Component({
  selector: 'app-message-add',
  templateUrl: './message-add.component.html',
  styleUrls: ['./message-add.component.css']
})
export class MessageAddComponent implements OnInit {
  loading: any;
  @Output() toggleAddMessageFormEvent = new EventEmitter;
  @Output() addMessageFormEvent = new EventEmitter;
  title: any;
  ckeditorContent: any;
  @Input() messageList: any;

  constructor(private messageService: MessageService) {
  }

  ngOnInit() {
  }

  createMessage(message) {
    this.loading = true;
    let messageListClone = _.clone(this.messageList);

    if (messageListClone && messageListClone.length < 2) {
      messageListClone.push({
        id: messageListClone.length + 1,
        title: message.title,
        body: message.body,
        expired_date: '',
        hidden: false
      });

      this.messageService.saveMessage(this.refineMessageList(messageListClone)).subscribe(response=>{
        this.addMessageFormEvent.emit();
      })
    }

  }

  toggleAddForm() {
    this.toggleAddMessageFormEvent.emit();
  }

  refineMessageList(messageListClone) {
    let messageObject = {
      messageOne: {},
      messageTwo: {}
    }
    messageListClone.forEach(message => {
      if (message.id === 1) {
        messageObject.messageOne = message;
      }

      if (message.id === 2) {
        messageObject.messageTwo = message;
      }

    })
    return messageObject;
  }


}