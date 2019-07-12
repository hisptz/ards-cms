import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';

@Injectable()
export class ReportTableService {
  subscription: Subscription = new Subscription();
  executedReports: any = {};
  // const relativePeriodsMatcher = [{

  // }]

  constructor(private http: Http) {}

  getReportTables() {
    return Observable.create(observer => {
      this.http
        .get('../../../api/reportTables.json?fields=:all&paging=false')
        .map((res: Response) => res.json())
        .catch(error => Observable.throw(new Error(error)))
        .subscribe(
          (response: any) => {
            const preparedReportTable = [
              {
                id: 'agriculture',
                state: true,
                name: 'Agriculture',
                children: []
              },
              {
                id: 'livestock',
                state: false,
                name: 'Livestock',
                children: []
              },
              { id: 'fishery', state: false, name: 'Fishery', children: [] },
              { id: 'trade', state: false, name: 'Trade', children: [] }
            ];

            if (response && response.hasOwnProperty('reportTables')) {
              const reportTables = response.reportTables;
              let indexId = 0;
              this.http
                .get(
                  '../../../api/me.json?fields=*,dataViewOrganisationUnits[id,name,level],organisationUnits[id,name,level]'
                )
                .map((res: Response) => res.json())
                .catch(error => Observable.throw(new Error(error)))
                .subscribe(userDetails => {
                  let observables = [];
                  reportTables.forEach(reportTable => {
                    const tableName = reportTable.name;
                    const relativePeriodsList = _.compact(
                      _.map(reportTable.relativePeriods, (item, index) =>
                        item == true ? _.toUpper(_.snakeCase(index)) : null
                      )
                    );
                    const relativeOrgunitList = _.compact(
                      _.map(reportTable, (value, key) => {
                        if (value == true) {
                          return key == 'userOrganisationUnitChildren'
                            ? 'USER_ORGUNIT_CHILDREN'
                            : key == 'userOrganisationUnit'
                            ? 'USER_ORGUNIT'
                            : key == 'userOrganisationUnitGrandChildren'
                            ? 'USER_ORGUNIT_GRANDCHILDREN'
                            : null;
                        }
                      })
                    );
                    const fixedPeriodList = _.map(reportTable.periods, 'id');
                    const fixedOrgunitList = _.map(
                      reportTable.organisationUnits,
                      'id'
                    );
                    const dataDimensionItemsList = _.compact(
                      _.map(reportTable.dataDimensionItems, data => {
                        const dataDimensionType = _.camelCase(
                          data.dataDimensionItemType
                        );
                        return data[dataDimensionType]
                          ? data[dataDimensionType]['id']
                          : null;
                      })
                    );

                    const detailsForAnalytics = {
                      id: reportTable.id,
                      pe: _.join(
                        fixedPeriodList.length > 0
                          ? fixedPeriodList
                          : relativePeriodsList,
                        ';'
                      ),
                      dx: _.join(dataDimensionItemsList, ';'),
                      ou: _.join(
                        fixedOrgunitList.length > 0
                          ? fixedOrgunitList
                          : relativeOrgunitList,
                        ';'
                      )
                    };
                    //observables.push(run());

                    if (tableName.indexOf(':') > 0) {
                      const splitName = tableName.split(':');
                      const parentIndex = _.findIndex(preparedReportTable, [
                        'name',
                        splitName[0]
                      ]);
                      if (parentIndex >= 0) {
                        preparedReportTable[parentIndex].children.push({
                          id: reportTable.id,
                          name: splitName[1],
                          link: _.camelCase(splitName[1]),
                          detailsForAnalytics: detailsForAnalytics
                        });
                      } else {
                        preparedReportTable.push({
                          id: '_' + indexId,
                          state: false,
                          name: splitName[0],
                          children: [{ name: splitName[1] }]
                        });
                        indexId++;
                      }
                    }
                  });
                  observer.next(preparedReportTable);
                  observer.complete();
                  // forkJoin(observables).subscribe(() => {
                  //   observer.next(preparedReportTable);
                  //   observer.complete();
                  // })
                });
            }
            /**
             * Return sanitized report tables
             */
            // console.log(preparedReportTable);
          },
          () => console.warn('You are offline')
        );
    });
  }

  getDataElements(dataElements): any {
    return this.http
      .get(
        'api/dataElements.json?fields=id,name,level&order=name:asc&paging=false&filter=id:in:' +
          dataElements
      )
      .map((response: Response) => response.json())
      .catch(error => Observable.throw(new Error(error)));
  }
}
