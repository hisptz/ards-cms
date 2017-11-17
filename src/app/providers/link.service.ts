import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class LinkService {

  subscription: Subscription = new Subscription();
  executedReports: any = {};

  constructor(private http: Http) {
  }

  getLinks() {
    return Observable.create(observer => {
      this.http.get('../../../api/dataStore/linksStorage/externalLinks')
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

  private _updateDataStoreLinks(links) {
    return Observable.create(observer => {
      this.http.put('../../../api/dataStore/linksStorage/externalLinks', links)
        .subscribe((response: any) => {
          observer.next(response);
          observer.complete();
        }, () => console.warn('You are offline'));
    });
  }


  saveLink(newLinksList) {
    return this._updateDataStoreLinks(newLinksList);
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
