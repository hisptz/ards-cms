import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class ArticleService {

  subscription: Subscription = new Subscription();
  executedReports: any = {};

  constructor(private http: Http) {
  }

  getArticles() {
    return Observable.create(observer => {
      this.http.get('../../../api/dataStore/articles/tabContents')
        .map((res: Response) => res.json())
        .catch(error => Observable.throw(new Error(error)))
        .subscribe((response: any) => {
          /**
           * Return sanitized report tables
           */
          observer.next(response);
          observer.complete();

        }, () => console.warn('You are offline'));
    });
  }

  private _updateDataStoreArticles(articles) {
    return Observable.create(observer => {
      this.http.put('../../../api/dataStore/articles/tabContents', articles)
        .subscribe((response: any) => {
          observer.next(response);
          observer.complete();
        }, () => console.warn('You are offline'));
    });
  }


  saveArticle(newArticleList) {
    return this._updateDataStoreArticles(newArticleList);
  }

  deleteDocument() {

  }

  private _prepareDisplayName(displayName) {
    let newDisplayName = '';
    if (displayName && displayName.length > 40) {
      newDisplayName = displayName.substr(0, 27) + '...';
    } else if (displayName) {
      newDisplayName = displayName;
    }

    return newDisplayName;
  }

}
