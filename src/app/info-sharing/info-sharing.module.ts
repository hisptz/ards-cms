/**
 * Created by mpande on 11/8/17.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InfoSharingComponent} from './info-sharing.component';
import {info_sharing_routing} from './info-sharing.routing';
import {InfoSharingListComponent} from "../components/info-sharing-list/info-sharing-list.component";
import {InfoSharingUpdateComponent} from "../components/info-sharing-update/info-sharing-update.component";
import {InfoSharingAddComponent} from "../components/info-sharing-add/info-sharing-add.component";
import {FormsModule} from "@angular/forms";
import {CKEditorModule} from "ng2-ckeditor";

@NgModule({
  imports: [
    CommonModule,
    info_sharing_routing,
    CKEditorModule,
    FormsModule
  ],
  declarations: [
    InfoSharingComponent,
    InfoSharingListComponent,
    InfoSharingUpdateComponent,
    InfoSharingAddComponent,
  ]
})
export class InfoSharingModule {
}
