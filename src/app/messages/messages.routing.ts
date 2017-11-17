/**
 * Created by kelvin on 11/23/16.
 */
import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MessagesComponent} from './messages.component';

export const messages_routing: ModuleWithProviders = RouterModule.forChild([
  { path: '', component: MessagesComponent }
]);
