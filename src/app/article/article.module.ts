/**
 * Created by mpande on 11/8/17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArticleComponent} from './article.component';
import {article_routing} from './article-routing.module';

@NgModule({
  imports: [
    CommonModule,
    article_routing
  ],
  declarations: [
  ]
})
export class ArticleModule { }
