import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArticleService} from "../../providers/article.service";

@Component({
  selector: 'app-article-add',
  templateUrl: './article-add.component.html',
  styleUrls: ['./article-add.component.css']
})
export class ArticleAddComponent implements OnInit {
  @Input() articles;
  @Input() currentSelectedCategory;
  @Input() ckeditorContent;
  @Input() menus;
  @Input() isUpdate;
  @Output() closeAddFormEvent = new EventEmitter;
  category: any;
  loading = false;

  constructor(private articleService: ArticleService) {
  }

  ngOnInit() {
  }

  toggleForm() {
    this.closeAddFormEvent.emit();
  }

  createArticle() {
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
      this.articles.push(article);
      this.articleService.saveArticle(this.articles).subscribe(response => {
        this.loading = false;
        this.closeAddFormEvent.emit({load: true});
      });
    }
  }


  updateArticle(updatedArticle) {

  }

  capitalize(stringCharacters) {
    return stringCharacters.replace(/(?:^|\s)\S/g, (a) => {
      return a.toUpperCase();
    });
  }

}
