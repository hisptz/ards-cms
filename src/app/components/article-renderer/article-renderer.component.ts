import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-article-renderer',
  templateUrl: './article-renderer.component.html',
  styleUrls: ['./article-renderer.component.css']
})
export class ArticleRendererComponent implements OnInit {
  @Input() article;
  @Output() updateArticleEvent = new EventEmitter;
  @Output() toggleHideShowArticleEvent = new EventEmitter;
  @Output() deleteArticleEvent = new EventEmitter;
  showDeleteOptions: Array<any> = [];

  constructor() {
  }

  ngOnInit() {
  }

  editArticle(article) {
    this.updateArticleEvent.emit(article);
  }

  toggleHideShow(article) {
    article.shown = !article.shown;
    this.toggleHideShowArticleEvent.emit(article);
  }

  toggleDeleteOptions(id) {
    this.showDeleteOptions[id]?this.showDeleteOptions[id]=!this.showDeleteOptions[id]:this.showDeleteOptions[id]=true;
  }

  deleteArticle(article) {
    this.deleteArticleEvent.emit(article);
  }
}
