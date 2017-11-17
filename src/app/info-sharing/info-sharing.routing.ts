/**
 * Created by kelvin on 11/23/16.
 */
import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import {InfoSharingComponent} from './info-sharing.component';

export const info_sharing_routing: ModuleWithProviders = RouterModule.forChild([
  { path: '', component: InfoSharingComponent }
]);
