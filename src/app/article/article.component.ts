import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ArticleService} from '../providers/article.service';
import {FormControl, FormGroup} from '@angular/forms';
import {HomeMenuService} from '../providers/homeMenus.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  articles: any;
  filteredArticles: any;
  currentSelectedCategory = 'all';
  showAddForm = false;
  ckeditorContent: any = '';
  menus: any;
  isUpdate = false;

  constructor(private route: ActivatedRoute, private articleService: ArticleService, private homeMenusService: HomeMenuService) {
    this.homeMenusService.getHomeMenus().subscribe(menus => {
      this.menus = ['All', ...menus];

      this.articleService.getArticles().subscribe(articles => {
        this.articles = articles;
        this.checkRouteChanges();
      });

    });
  }

  ngOnInit() {
    this.checkRouteChanges();
  }


  onCloseFormEvent($event) {
    this.showAddForm = !this.showAddForm;
    if ($event && $event.load) {
      this.checkRouteChanges();
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
