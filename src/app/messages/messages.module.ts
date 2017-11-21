/**
 * Created by mpande on 11/8/17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessagesComponent} from './messages.component';
import {messages_routing} from './messages.routing';
import {MessageListComponent} from "../components/message-list/message-list.component";
import {MessageAddComponent} from "../components/message-add/message-add.component";
import {MessageUpdateComponent} from "../components/message-update/message-update.component";
import {CKEditorModule} from "ng2-ckeditor";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    messages_routing,
    CKEditorModule,
    FormsModule
  ],
  declarations: [
    MessagesComponent,
    MessageListComponent,
    MessageAddComponent,
    MessageUpdateComponent,
  ]
})
export class MessagesModule { }
