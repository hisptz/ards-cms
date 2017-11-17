/**
 * Created by mpande on 11/8/17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessagesComponent} from './messages.component';
import {messages_routing} from './messages.routing';

@NgModule({
  imports: [
    CommonModule,
    messages_routing
  ],
  declarations: [
    MessagesComponent
  ]
})
export class MessagesModule { }
