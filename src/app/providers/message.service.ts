import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class MessageService {

  subscription: Subscription = new Subscription();
  executedReports: any = {};

  constructor(private http: Http) {
  }

  getMessages() {
    return Observable.create(observer => {
      this.http.get('../../../api/dataStore/messages/textMessages')
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

  private _updateDataStoreMessages(messages) {
    return Observable.create(observer => {
      this.http.put('../../../api/dataStore/messages/textMessages', messages)
        .subscribe((response: any) => {
          observer.next(response);
          observer.complete();
        }, () => console.warn('You are offline'));
    });
  }


  saveMessage(newArticleList) {
    return this._updateDataStoreMessages(newArticleList);
  }


}
