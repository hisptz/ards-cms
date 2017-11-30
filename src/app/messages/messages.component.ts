import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from "../providers/message.service";
import * as _ from 'lodash';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @Input() messageList: any;
  @Input() actionLoadingMessage: string;
  @Input() actionLoading: boolean;
  showAddForm = false;
  showEditForm = false;
  updatedMessage: any;

  constructor(private messageService: MessageService) {
    this.actionLoading = true;
    this.actionLoadingMessage = 'Loading messages please wait ....';
    this.getMessages();
  }

  ngOnInit() {
  }

  getMessages() {
    this.actionLoading = true;
    this.actionLoadingMessage = 'Loading messages please wait ....';
    this.messageService.getMessages().subscribe(messages => {
      const messageArray = [];
      const keys = Object.getOwnPropertyNames(messages);
      keys.forEach(key => {
        messageArray.push(messages[key]);
      });
      this.messageList = messageArray;
      this.actionLoading = false;
    });
  }

  addMessage() {
    this.showAddForm = true;
  }

  onAddMessageEvent($event) {
    this.showEditForm = true;
    // this.actionLoading = true;
    // this.actionLoadingMessage = 'Loading message please wait ....';
    console.log(this.messageList);
  }

  onEditMessageEvent($event) {
    this.showEditForm = true;
    this.updatedMessage = $event;
  }

  onToggleHideShowMessageEvent($event) {
    const message = $event;
    this.actionLoading = true;
    this.actionLoadingMessage = message.hidden ? 'Hiding message please wait ....' : 'Making message visible please wait ....';
    let messageListClone = _.clone(this.messageList);
    const newMessageList = [];
    messageListClone.forEach(messageItem => {
      if (messageItem.id === message.id) {
        newMessageList.push(message);
      } else {
        newMessageList.push(messageItem);
      }
    });
    this.refineMessageList(newMessageList);
    this.messageService.saveMessage(this.refineMessageList(newMessageList)).subscribe(response => {
      this.getMessages();
    })
    console.log($event);

  }

  onToggleAddMessageFormEvent($event) {
    this.showAddForm = false;
    if ($event && $event.load) {
      this.getMessages();
    }
  }

  onToggleEditMessageFormEvent($event) {
    this.showEditForm = false;
    if ($event && $event.load) {
      this.getMessages();
    }
  }


  onDeleteMessageEvent($event) {
    this.actionLoading = true;
    this.actionLoadingMessage = 'Deleting message please wait ....';
    let messageObject = {};

      if ($event.id === 1) {
        messageObject['messageTwo'] = this.messageList[_.findIndex(this.messageList, ['id',2])]
      }

      if ($event.id === 2) {
        messageObject['messageOne'] = this.messageList[_.findIndex(this.messageList, ['id',1])];
      }

    this.messageService.saveMessage(messageObject).subscribe(response => {
      this.getMessages();
    })
  }

  refineMessageList(messageListClone) {
    let messageObject = {}
    messageListClone.forEach(message => {
      if (message.id === 1) {
        messageObject['messageOne'] = message;
      }

      if (message.id === 2) {
        messageObject['messageTwo'] = message;
      }

    })
    return messageObject;
  }

}
