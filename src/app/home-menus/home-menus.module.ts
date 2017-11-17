/**
 * Created by mpande on 11/8/17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeMenusComponent} from './home-menus.component';
import {home_menus_routing} from './home-menus.routing';

@NgModule({
  imports: [
    CommonModule,
    home_menus_routing
  ],
  declarations: [
    HomeMenusComponent
  ]
})
export class HomeMenusModule { }
