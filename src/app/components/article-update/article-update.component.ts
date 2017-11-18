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



  updateArticle() {
    this.loading = true;
    this.category = !this.category || this.category === "" ? this.currentSelectedCategory : this.category;
    if (this.category) {
      const article = {
        id: this.articles.length,
        category: this.capitalize(this.category),
        content: this.ckeditorContent,
        order: 1,
        shown: true
      };

      console.log(article);

      // this.articles.push(article);
      // this.articleService.saveArticle(this.articles).subscribe(response => {
      //   this.loading = false;
      //   this.closeEditFormEvent.emit({load: true});
      // });
    }
  }

  capitalize(stringCharacters) {
    return stringCharacters.replace(/(?:^|\s)\S/g, (a) => {
      return a.toUpperCase();
    });
  }


}

