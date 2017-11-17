/**
 * Created by kelvin on 08/09/17.
 */
import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ArticleComponent} from './article.component';

export const article_routing: ModuleWithProviders = RouterModule.forChild([
  {path: '', redirectTo: 'articles/all', pathMatch: 'full'},
  {path: 'articles/:articlesCategory', component: ArticleComponent}
]);
