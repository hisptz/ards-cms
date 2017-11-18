import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArticleService} from '../../providers/article.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-article-update',
  templateUrl: './article-update.component.html',
  styleUrls: ['./article-update.component.css']
})
export class ArticleUpdateComponent implements OnInit {
  @Input() articles;
  @Input() article;
  @Input() currentSelectedCategory;
  @Input() ckeditorContent;
  @Input() menus;
  @Input() isUpdate;
  @Output() closeEditFormEvent = new EventEmitter;
  category: any;
  loading = false;

  constructor(private articleService: ArticleService) {
  }

  ngOnInit() {
    this.category = this.currentSelectedCategory;
  }

  toggleForm() {
    this.closeEditFormEvent.emit();
  }


  updateArticle(article) {
    this.loading = true;
    const articles = _.clone(this.articles);

    if (articles) {
      const articlesUpdated = [];
      articles.filter(currentArticle => {
        currentArticle.id !== article.id ? articlesUpdated.push(currentArticle) : articlesUpdated.push(article);
      });
      this.articles = articlesUpdated;
    }

    this.articleService.saveArticle(this.articles).subscribe(response => {
      this.loading = false;
      this.closeEditFormEvent.emit({load: true});
    });

  }


  capitalize(stringCharacters) {
    return stringCharacters.replace(/(?:^|\s)\S/g, (a) => {
      return a.toUpperCase();
    });
  }


}

