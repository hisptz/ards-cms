/**
 * Created by kelvin on 11/23/16.
 */
import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HomeMenusComponent} from './home-menus.component';

export const home_menus_routing: ModuleWithProviders = RouterModule.forChild([
  { path: '', component: HomeMenusComponent }
]);
