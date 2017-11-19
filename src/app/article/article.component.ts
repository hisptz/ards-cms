import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ArticleService} from '../providers/article.service';
import {FormControl, FormGroup} from '@angular/forms';
import {HomeMenuService} from '../providers/homeMenus.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  articles: any;
  updatedArticle: any;
  filteredArticles: any;
  currentSelectedCategory = 'all';
  showAddForm = false;
  showEditForm = false;
  ckeditorContent: any = '';
  menus: any;
  isUpdate = false;
  actionLoading = false;
  actionLoadingMessage = '';

  constructor(private route: ActivatedRoute, private articleService: ArticleService, private homeMenusService: HomeMenuService) {
    this.actionLoading = true;
    this.actionLoadingMessage = 'loading sectors please wait ...';
    this.homeMenusService.getHomeMenus().subscribe(menus => {
      this.menus = ['All', ...menus];
      this.getAllArticles();

    });
  }

  ngOnInit() {
    this.checkRouteChanges();
  }

  getAllArticles() {
    this.articles = null;

      this.actionLoading = true;
      this.actionLoadingMessage = 'loading articles please wait ...';

    return this.articleService.getArticles().subscribe(articles => {
      this.articles = articles;
      this.checkRouteChanges();
      this.actionLoading = false;
      this.actionLoadingMessage = '';
    });
  }

  onUpdateArticleEvent($event) {
    const article = $event;
    if (article) {
      this.isUpdate = true;
      this.currentSelectedCategory = article.category;
      this.ckeditorContent = article.content;
      this.updatedArticle = article;
      this.showEditForm = !this.showEditForm;
    }
  }

  onDeleteArticleEvent($event) {
    this.actionLoading = true;
    this.actionLoadingMessage = 'deleting article...';
    const article = $event;
    if (article) {
      const articles = _.clone(this.articles);
      if (articles) {
        this.articles = null;
        const articlesUpdated = [];
        articles.filter(currentArticle => {
          currentArticle.id !== article.id ? articlesUpdated.push(currentArticle) : null;
        });
        this.articles = articlesUpdated;
      }

      this.articleService.saveArticle(this.articles).subscribe(response => {
        this.getAllArticles();
      });

    }
  }


  onToggleHideShowArticleEvent($event) {
    const article = $event;
    if (article) {
      const articles = _.clone(this.articles);
      if (articles) {
        const articlesUpdated = [];
        articles.filter(currentArticle => {
          currentArticle.id !== article.id ? articlesUpdated.push(currentArticle) : articlesUpdated.push(article);
        });
        this.articles = articlesUpdated;
      }

      this.articleService.saveArticle(this.articles).subscribe(response => {
        this.getAllArticles();
      });

    }
  }

  onCloseAddFormEvent($event) {
    this.isUpdate = false;
    this.showAddForm = !this.showAddForm;
    if ($event && $event.load) {
      this.getAllArticles();
    }
  }

  onCloseEditFormEvent($event) {
    this.isUpdate = false;
    this.showEditForm = !this.showEditForm;
    if ($event && $event.load) {
      this.getAllArticles();
    }
  }

  checkRouteChanges() {
    this.route.params.subscribe(params => {
      this.currentSelectedCategory = params.articlesCategory;
      this.filteredArticles = null;
      if (!params.articlesCategory || params.articlesCategory.toString() === 'all') {
        this.filteredArticles = this.articles;
      } else {
        this.filteredArticles = this.getFilteredArticles(params, this.articles);
      }

    });
  }

  getFilteredArticles(category, articles) {
    category = category.articlesCategory.toString().toLowerCase();
    let filteredArticles = null;
    if (articles) {
      filteredArticles = articles.filter(article => {
        const articleCategory = article.category.toString().toLowerCase();
        if (category === articleCategory) {
          return article;
        }
      });
    }

    return filteredArticles;
  }

}
