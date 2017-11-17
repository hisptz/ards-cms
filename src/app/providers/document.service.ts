import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class DocumentService {

  subscription: Subscription = new Subscription();
  executedReports: any = {};

  constructor(private http: Http) {
  }

  getDocuments() {
    return Observable.create(observer => {
      this.http.get('../../../api/documents.json?paging=false')
        .map((res: Response) => res.json())
        .catch(error => Observable.throw(new Error(error)))
        .subscribe((response: any) => {
          const preparedDocuments = [];


          if (response && response.hasOwnProperty('documents')) {
            const documents = response.documents;
            documents.forEach(document => {
              const id = document.id;
              const documentName = document.displayName;
              const documentDisplayName = document.displayName;
              preparedDocuments.push({
                id: id,
                name: documentName,
                displayName: this._prepareDisplayName(documentDisplayName),
                hidden: false
              });
            });
          }

          this._getDataStoreDocuments().subscribe(dataStoreDocuments => {

            if (dataStoreDocuments.length > 0) {
              this._updateDataStoreDocuments(preparedDocuments).subscribe(dataStoreResponse => {
                /**
                 * Return sanitized report tables
                 */
                observer.next(preparedDocuments);
                observer.complete();
              });
            } else {
              preparedDocuments.forEach(preparedDocument => {
                const documentIndex = _.findIndex(dataStoreDocuments, ['id', preparedDocument.id]);
                if (documentIndex < 0) {
                  dataStoreDocuments.push(preparedDocument);
                }
              });

              /**
               * Return sanitized report tables
               */
              observer.next(preparedDocuments);
              observer.complete();
            }
          });


        }, () => console.warn('You are offline'));
    });
  }

  private _updateDataStoreDocuments(documents) {
    return Observable.create(observer => {
      this.http.put('../../../api/dataStore/documents/shownDocuments', documents)
        .subscribe((response: any) => {
          observer.next(response);
          observer.complete();
        }, () => console.warn('You are offline'));
    });
  }

  private _getDataStoreDocuments() {
    return Observable.create(observer => {
      this.http.get('../../../api/dataStore/documents/shownDocuments')
        .map((res: Response) => res.json())
        .catch(error => Observable.throw(new Error(error)))
        .subscribe((response: any) => {
          observer.next(response);
          observer.complete();
        }, () => console.warn('You are offline'));
    });
  }

  saveDocument() {

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
