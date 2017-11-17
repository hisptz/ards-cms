import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class HomeMenuService {

  subscription: Subscription = new Subscription();
  executedReports: any = {};

  constructor(private http: Http) {
  }

  getHomeMenus() {
    return Observable.create(observer => {
      this.http.get('../../../api/dataStore/articles/tabs')
        .map((res: Response) => res.json())
        .catch(error => Observable.throw(new Error(error)))
        .subscribe((response: any) => {
          /**
           * Return sanitized report tables
           */
          observer.next(this._refineMenus(response));
          observer.complete();

        }, () => console.warn('You are offline'));
    });
  }

  private _refineMenus(response) {
    let menus = [];
    if (response && response.length > 0) {
      menus = response.filter(menu => {
        if (menu !== null) {
          return menu;
        }
      });
    }

    return menus;
  }

  private _updateDataStoreMenus(menus) {
    return Observable.create(observer => {
      this.http.put('../../../api/dataStore/articles/tabs', menus)
        .subscribe((response: any) => {
          observer.next(response);
          observer.complete();
        }, () => console.warn('You are offline'));
    });
  }


  saveMenu(newMenuList) {
    return this._updateDataStoreMenus(newMenuList);
  }

  deleteDocument() {

  }

  // private _prepareDisplayName(displayName) {
  //   let newDisplayName = '';
  //   if (displayName && displayName.length > 40) {
  //     newDisplayName = displayName.substr(0, 27) + '...';
  //   } else if (displayName) {
  //     newDisplayName = displayName;
  //   }
  //
  //   return newDisplayName;
  // }

}
