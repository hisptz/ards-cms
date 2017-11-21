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

  // messageList = [{
  //   "messageOne": {
  //     "id": 1,
  //     "title": "HOW TO CLEAR CACHE",
  //     "body": "<p>1. Click &quot;Clear cache&quot; button on your right<br />\n2. Scroll down, Click &quot;Select all&quot; and clear cache<br />\n3. Go back.</p>\n",
  //     "expired_date": "",
  //     "hidden": false
  //   }
  // },
  //   {
  //     "messageTwo": {
  //       "id": 2,
  //       "title": "FOMU YA MWEZI WA TATU KUTOONEKANA",
  //       "body": "<p>Fomu ya mwezi wa 3 haiwezi kuonekana sasa, tunatarajia kwamba DS na DME wataanza kupokea fomu hizo wiki ya kwanza ya mwezi wa 4.</p>\n",
  //       "expired_date": "",
  //       "hidden": false
  //     }
  //   }
  // ];

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
