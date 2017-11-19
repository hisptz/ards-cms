/**
 * Created by mpande on 11/8/17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeMenusComponent} from './home-menus.component';
import {home_menus_routing} from './home-menus.routing';
import {HomePageMenuListComponent} from '../components/home-page-menu-list/home-page-menu-list.component';
import {HomePageMenuAddComponent} from '../components/home-page-menu-add/home-page-menu-add.component';
import {HomePageMenuUpdateComponent} from '../components/home-page-menu-update/home-page-menu-update.component';

@NgModule({
  imports: [
    CommonModule,
    home_menus_routing
  ],
  declarations: [
    HomeMenusComponent,
    HomePageMenuListComponent,
    HomePageMenuAddComponent,
    HomePageMenuUpdateComponent

  ]
})
export class HomeMenusModule { }
