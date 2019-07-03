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
    console.log(this.messageList);
    let messageListClone = _.clone(this.messageList);

    if (messageListClone && messageListClone.length < 2) {
      messageListClone.push({
        id: messageListClone.length>0?messageListClone.length + 1:1,
        title: message.title,
        body: message.body,
        expired_date: '',
        hidden: false
      });
      console.log(messageListClone);
      this.messageService.saveMessage(this.refineMessageList(messageListClone)).subscribe(response=>{
        this.toggleAddMessageFormEvent.emit({load:true});
      })
    }

  }

  toggleAddForm() {
    this.toggleAddMessageFormEvent.emit();
  }

  refineMessageList(messageListClone) {
    let messageObject = {
    }
    messageListClone.forEach((message, index) => {
      if ((index + 1) === 1) {
        messageObject['messageOne'] = {
          ...message,
          id: 1
        };
      }

      if ((index + 1) === 2) {
        messageObject['messageTwo'] = {
          ...message,
          id: 2
        };
      }

    })
    console.log(messageObject);
    return messageObject;
  }


}
