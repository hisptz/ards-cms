/**
 * Created by mpande on 11/8/17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InfoSharingComponent} from './info-sharing.component';
import {info_sharing_routing} from './info-sharing.routing';

@NgModule({
  imports: [
    CommonModule,
    info_sharing_routing
  ],
  declarations: [
    InfoSharingComponent
  ]
})
export class InfoSharingModule { }
