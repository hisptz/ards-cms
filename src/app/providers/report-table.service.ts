import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class ReportTableService {

  subscription: Subscription = new Subscription();
  executedReports: any = {};

  constructor(private http: Http) {
  }

  getReportTables() {
    return Observable.create(observer => {
      this.http.get('../../../api/reportTables.json?fields=:all&paging=false')
        .map((res: Response) => res.json())
        .catch(error => Observable.throw(new Error(error)))
        .subscribe((response: any) => {
          const preparedReportTable = [
            {id: 'agriculture', state: true, name: 'Agriculture', children: []},
            {id: 'livestock', state: false, name: 'Livestock', children: []},
            {id: 'fishery', state: false, name: 'Fishery', children: []},
            {id: 'trade', state: false, name: 'Trade', children: []},
          ];


          if (response && response.hasOwnProperty('reportTables')) {
            const reportTables = response.reportTables;
            let indexId = 0;
            reportTables.forEach(reportTable => {
              const tableName = reportTable.name;
              if (tableName.indexOf(':') > 0) {
                const splitName = tableName.split(':');
                const parentIndex = _.findIndex(preparedReportTable, ['name', splitName[0]]);
                if (parentIndex >= 0) {
                  preparedReportTable[parentIndex].children.push({name: splitName[1]});
                } else {
                  preparedReportTable.push({id: '_' + indexId, state: false, name: splitName[0], children: [{name: splitName[1]}]});
                }
              }
              indexId++;
            });
          }

          /**
           * Return sanitized report tables
           */
          observer.next(preparedReportTable);
          observer.complete();

        }, () => console.warn('You are offline'));
    });
  }


}
