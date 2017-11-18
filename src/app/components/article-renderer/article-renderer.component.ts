import {Component, Input,Output,EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'app-article-renderer',
  templateUrl: './article-renderer.component.html',
  styleUrls: ['./article-renderer.component.css']
})
export class ArticleRendererComponent implements OnInit {
  @Input() article;
  @Output() updateArticleEvent = new EventEmitter;
  constructor() { }

  ngOnInit() {
  }

  editArticle(article){
    this.updateArticleEvent.emit(article);
  }

}
