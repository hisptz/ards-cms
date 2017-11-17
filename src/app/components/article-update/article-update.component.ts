import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArticleService} from '../../providers/article.service';

@Component({
  selector: 'app-article-update',
  templateUrl: './article-update.component.html',
  styleUrls: ['./article-update.component.css']
})
export class ArticleUpdateComponent implements OnInit {
  @Input() articles;
  @Input() currentSelectedCategory;
  @Input() ckeditorContent;
  @Input() menus;
  @Input() isUpdate;
  @Output() closeFormEvent = new EventEmitter;
  category: any;

  constructor(private articleService: ArticleService) {
  }

  ngOnInit() {
  }

  toggleForm() {
    this.closeFormEvent.emit();
  }

  createArticle() {

    this.category = !this.category || this.category === "" ? this.currentSelectedCategory : this.category;
    if (this.category) {
      const article = {
        category: this.capitalize(this.category),
        content: this.ckeditorContent,
        order: 1,
        shown: true
      };
      this.articles.push(article);
      this.articleService.saveArticle(this.articles).subscribe(response => {
        this.closeFormEvent.emit({load: true});
      });
    }
  }

  capitalize(stringCharacters) {
    return stringCharacters.replace(/(?:^|\s)\S/g, (a) => {
      return a.toUpperCase();
    });
  }


}

