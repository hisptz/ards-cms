import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable, Subscription} from "rxjs";
import * as _ from 'lodash';

export const REPORT_OPTIONS = ['ACTUAL_REPORTS', 'EXPECTED_REPORTS','REPORTING_RATE','ACTUAL_REPORTS_ON_TIME','REPORTING_RATE_ON_TIME'];

export const REQUIRED_DATASETS = [
  {id: "K24dTOb3JHc",type: "entry", sortOrder: 7, assignedLowestLevel: 3, nameArray: []},
  {id: "Wtzj9Chl3HW",type: "entry", sortOrder: 6, assignedLowestLevel: 3, nameArray: []},
  {id: "zk2Q65fuBjl",type: "entry", sortOrder: 2, assignedLowestLevel: 4, nameArray: []},
  {id: "p3R3pn2tbCc",type: "entry", sortOrder: 5, assignedLowestLevel: 4, nameArray: []},
  {id: "sJZpLgWm8KK",type: "entry", sortOrder: 4, assignedLowestLevel: 4, nameArray: []},
  {id: "Ba9mZCFaUCV",type: "entry", sortOrder: 3, assignedLowestLevel: 4, nameArray: []},
  {id: "cSC1VV8uMh9",type: "report", sortOrder: 8, assignedLowestLevel: 3, nameArray: [{level: 2, name: 'Region Monthly Report (RR01)'},{level: 3, name: 'District Monthly Report (DR01)'}]},
  {id: "Znn30Q67yDO",type: "report", sortOrder: 9, assignedLowestLevel: 3, nameArray: [{level: 2, name:'Region Quarterly Report (RR02)'}, {level: 3, name: 'District Quarterly Report (DR02)'}]},
  {id: "OBnVfEenAuW",type: "report", sortOrder: 10, assignedLowestLevel: 3, nameArray: [{level: 2, name:'Region Annual Report (RR03)'},{level: 3, name:'District Annual Report (DR03)'}]},
  {id: "QLoyT2aHGes",type: "report", sortOrder: 11, assignedLowestLevel:3, nameArray: [{level: 1, name:'Quarterly Integrated Report (NIR02)'}, {level: 2, name:'Quarterly Integrated Report (RIR02)'}, {level: 3, name: 'Quarterly Integrated Report (DIR02)'}]},
  {id: "HhyM40b8ma1",type: "report", sortOrder: 12, assignedLowestLevel: 3, nameArray: [{level: 1, name: 'Annual Integrated Report (NIR03)'},{level: 2, name:'Annual Integrated Report (RIR03)'},{level: 3, name:'Annual Integrated Report (DIR03)'}]},
  {id: "XQE2574S08o",type: "entry", sortOrder: 1, assignedLowestLevel: 3, nameArray: []},
];

@Injectable()
export class DatasetService {

  subscription: Subscription = new Subscription();
  executedReports: any = {};
  constructor(
    private http: Http
  ) { }

  getAssignedDataSets(orgUnit: any): Observable<any> {
    return Observable.create(observer => {
      this.http.get('../../../api/dataSets.json?fields=id,displayName,periodType&filter=organisationUnits.path:ilike:'+ orgUnit.orgUnitId +'&paging=false')
        .map((res: Response) => res.json())
        .catch((error) => Observable.throw(new Error(error)))
        .subscribe((response: any) => {
            let sanitizedDataSets: any[] = [];
            if(response.hasOwnProperty('dataSets') && response.dataSets.length > 0) {
              response.dataSets.forEach((dataSet) => {
                let allowedDataSet = this._findAllowedDataset(dataSet.id, REQUIRED_DATASETS);
                if(allowedDataSet != null && orgUnit.orgUnitLevel <= allowedDataSet.assignedLowestLevel) {
                  sanitizedDataSets.push({
                    id: dataSet.id,
                    periodType: dataSet.hasOwnProperty('periodType') ? dataSet.periodType : null,
                    name: this._getDatasetSanitizedName(dataSet.displayName, allowedDataSet.type),
                    sortOrder: allowedDataSet.sortOrder,
                    type: allowedDataSet.type,
                    status: allowedDataSet.type == 'entry' ? 'Submission' : 'Report Creation',
                    headerName: allowedDataSet.type == 'entry' ? 'Entry forms' : 'Reports',
                    assignedLowestLevel: allowedDataSet.assignedLowestLevel
                  });
                }
              })
            } else {
              console.warn('returned value does not have datasets in it')
            }

          /**
           * Return sanitized datasets
           */
          observer.next(this._sortDataSets(sanitizedDataSets));
            observer.complete();
        }, dataSetError => {
          observer.error(dataSetError);
        })
    })
  }

  private _getDatasetSanitizedName(assignedDataSetName, dataSetType): string {
    let name: string = assignedDataSetName + ' ' ;
    name +=  dataSetType == 'entry' ? 'Submission' : 'Creation';
    return name;
  }

  private _findAllowedDataset(assignedDataSetsId: string, requiredDatasets: any[]): any {
    let allowedDataset: any = null;
    if(requiredDatasets.length > 0) {
      for(let dataset of requiredDatasets) {
        if(dataset.id == assignedDataSetsId) {
          allowedDataset = dataset;
          break;
        }
      }
    }
    return allowedDataset;
  }

  private _sortDataSets(dataSets) {
    return dataSets.sort((a, b) => {return a.sortOrder - b.sortOrder});
  }

  private _sortReportBasedOnParent(reportData) {

  }
  getDataSetReportFromAnalytics(datasetId, orgunitId, periodId): Observable<any>{
    return Observable.create(observer => {

      this.http.get('../../../api/analytics.json?dimension=dx:' +this._getDataParameters(datasetId, REPORT_OPTIONS) + '&dimension=ou:' + orgunitId + '&filter=pe:' + periodId + '&displayProperty=NAME&outputIdScheme=UID')
        .map((res: Response) => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(reportResult => {
          observer.next(this._organizeDataFromAnalytics(this._getMetadataIdentifiersFromAnalytics(reportResult),reportResult));
          observer.complete();
        }, reportError => observer.error(reportError));
    })
  }

  getDataSetReportFromSqlView(reportParams) {
    let combinedReportData: any[] = [];
    const selectedDataSet = _.find(REQUIRED_DATASETS, ['id',reportParams.datasetId]);
    const startingLevel = reportParams.datasetType === 'entry' && selectedDataSet.id !== 'XQE2574S08o' ? reportParams.childrenLevel : reportParams.orgunitLevel;
    const endingLevel = reportParams.datasetType === 'report' || selectedDataSet.id === 'XQE2574S08o' ? reportParams.childrenLevel > 2 ? reportParams.childrenLevel : reportParams.childrenLevel + 1 : reportParams.childrenLevel;
    return Observable.create(observer => {
      for(let level = startingLevel; level <= endingLevel; level++) {
        this.http.get('../../../api/sqlViews/FIfbenVekHp/data.json?var=datasetId:' + reportParams.datasetId + '&var=orgUnitId:' + reportParams.orgunitId + '&var=orgUnitChildrenLevel:' + level + '&var=period:' + reportParams.periodId + '&var=reportGenarationDate:' + reportParams.reportDate)
          .map((res: Response) => res.json())
          .catch(error => Observable.throw(new Error(error)))
          .subscribe((result:any) => {
            let dataIndex: any = {};
            if(result.hasOwnProperty('headers')) {
              result.headers.forEach((headerValue, headerIndex) => {
                dataIndex[headerValue.name] = headerIndex;
              })
            }
            let compiledData: any[] = [];
            if(result.hasOwnProperty('rows')) {
              if(reportParams.datasetType == 'report') {
                this.getCreationStatus(result.rows, reportParams, dataIndex).subscribe(rows => {
                  rows.forEach(row => {
                    compiledData.push({
                      uid: row[dataIndex.uid],
                      grandParent: row[dataIndex.grandparentname],
                      parentName: row[dataIndex.parentname],
                      name: row[dataIndex.name],
                      level: row[dataIndex.level],
                      personInCharge: row[dataIndex.personincharge],
                      ACTUAL_REPORTS: row[dataIndex.completed],
                      EXPECTED_REPORTS: row[dataIndex.expected],
                      REPORTING_RATE: this.calculateRate(row[dataIndex.completed], row[dataIndex.expected]),
                      ACTUAL_REPORTS_ON_TIME: row[dataIndex.ontime],
                      REPORTING_RATE_ON_TIME: this.calculateRate(row[dataIndex.ontime], row[dataIndex.expected])
                    })
                  });

                  const nameObject = _.find(selectedDataSet.nameArray,['level', level]);
                  if(level < reportParams.childrenLevel) {
                    let expectedCount: number = compiledData.map(data => {return data.EXPECTED_REPORTS}).reduce((total, expected) => { return parseInt(total) + parseInt(expected) });
                    if(expectedCount > 0) {

                      combinedReportData.push({level: level, title: nameObject ? nameObject.name : null, data: compiledData})
                    }
                  } else {
                    combinedReportData.push({level: level, title: reportParams.orgUnitLevel === reportParams.childrenLevel ? undefined : nameObject ? nameObject.name : undefined, data: compiledData})
                  }
                  if(level === endingLevel) {
                    const reportSanitizedReportData = this.getSanitizedReportTypeData(combinedReportData, reportParams.childrenLevel, reportParams.orgunitLevel);
                    observer.next({personInCharge: this.getPersonInCharge(combinedReportData,reportParams.orgunitLevel), data: reportSanitizedReportData.sort((a, b) => {return a.level - b.level}), mergedData: this.getMergedReportData(reportSanitizedReportData.sort((a, b) => {return a.level - b.level}))});
                    observer.complete();
                  }

                })
              } else {
                result.rows.forEach(row => {
                  compiledData.push({
                    uid: row[dataIndex.uid],
                    grandParent: row[dataIndex.grandparentname],
                    parentName: row[dataIndex.parentname],
                    name: row[dataIndex.name],
                    level: row[dataIndex.level],
                    personInCharge: row[dataIndex.personincharge],
                    ACTUAL_REPORTS: this.sanitizeReportResult(row[dataIndex.completed], reportParams.orgunitLevel === reportParams.childrenLevel ? true : false),
                    EXPECTED_REPORTS: this.sanitizeReportResult(row[dataIndex.expected], reportParams.orgunitLevel === reportParams.childrenLevel ? true : false),
                    REPORTING_RATE: this.calculateRate(row[dataIndex.completed], row[dataIndex.expected]),
                    ACTUAL_REPORTS_ON_TIME: row[dataIndex.ontime],
                    REPORTING_RATE_ON_TIME: this.calculateRate(row[dataIndex.ontime], row[dataIndex.expected])
                  })
                });

                if(level < reportParams.childrenLevel) {
                  let expectedCount: number = compiledData.map(data => {return data.EXPECTED_REPORTS}).reduce((total, expected) => { return parseInt(total) + parseInt(expected) });
                  if(expectedCount > 0) {
                    combinedReportData.push({level: level, data: compiledData})
                  }
                } else {
                  combinedReportData.push({level: level, data: compiledData})
                }

                if(level === endingLevel) {
                  const sanitizedReportData = selectedDataSet.id === 'XQE2574S08o' ? this.getSanitizedDataForPriorEstimate(combinedReportData, reportParams.childrenLevel, reportParams.orgunitLevel) : combinedReportData;
                  observer.next({personInCharge: this.getPersonInCharge(combinedReportData,reportParams.orgunitLevel), data: sanitizedReportData.sort((a, b) => {return a.level - b.level}), mergedData: this.getMergedReportData(sanitizedReportData.sort((a, b) => {return a.level - b.level}))});
                  observer.complete();
                }
              }
            }
          }, error => observer.error(error))
      }

    })
  }

  getMergedReportData(compiledData) {
    return compiledData.map(dataObject => {
      const groupedDataItem = _.groupBy(dataObject.data, 'parentName');
      const dataItemKeys = _.keys(groupedDataItem);
      let newDataItem: any[] = [];
      dataItemKeys.forEach(key => {
        groupedDataItem[key].forEach((value, index) => {
          if(index == 0) {
            value.rowSpan = groupedDataItem[key].length;
          }

          if(value.parentName == '') {
            value.colSpan = 2;
          }
          newDataItem.push(value)
        })
      });
      dataObject.data = newDataItem;
      return dataObject;
    })
  }

  getSanitizedDataForPriorEstimate(combinedReportData, childrenLevel, orgunitLevel) {
    const sanitizedValue = this.getSanitizedReportTypeData(combinedReportData, childrenLevel, orgunitLevel);
    const newValue = _.filter(sanitizedValue, ['level', childrenLevel == 2 ? childrenLevel + 1 : childrenLevel]);
    return newValue.length > 0 ? newValue.map(value => {value.level = childrenLevel; return value}) : sanitizedValue;
  }

  getSanitizedReportTypeData(compiledReportData, childrenLevel, orgunitLevel) {
    return this.compileReportDataBasedOnChildren(this.recalculateReportData(compiledReportData.filter(reportData => { return reportData.title !== null}), orgunitLevel), childrenLevel);
  }

  compileReportDataBasedOnChildren(combinedReportData, childrenLevel) {
    const correspondingData = combinedReportData.filter(reportData => { return reportData.level === childrenLevel});

    if(!correspondingData) {
      return [];
    }
    return combinedReportData.map(reportData => { return this.compileData(reportData,correspondingData[0],childrenLevel)});
  }

  compileData(reportData, correspondingData, childrenLevel) {
    const newReport = _.clone(reportData);
    let newReportData: any = reportData.level > childrenLevel ? reportData.data : null;
    if(newReportData !== null) {
      const groupedData = _.groupBy(newReportData, 'parentName');
      newReport.data = correspondingData.data.map(dataValue => {
        const groupName = dataValue.parentName !== '' ? dataValue.name : '';
        const newDataValue = _.clone(dataValue);
        newDataValue.EXPECTED_REPORTS = groupedData[groupName].map(groupedValue => { return groupedValue.EXPECTED_REPORTS }).reduce((sum, value) => { return parseInt(sum) + parseInt(value)});
        newDataValue.ACTUAL_REPORTS = groupedData[groupName].map(groupedValue => { return groupedValue.ACTUAL_REPORTS }).reduce((sum, value) => { return parseInt(sum) + parseInt(value)});
        newDataValue.ACTUAL_REPORTS_ON_TIME = groupedData[groupName].map(groupedValue => { return groupedValue.ACTUAL_REPORTS_ON_TIME }).reduce((sum, value) => { return parseInt(sum) + parseInt(value)});
        newDataValue.REPORTING_RATE = this.calculateRate(newDataValue.ACTUAL_REPORTS, newDataValue.EXPECTED_REPORTS);
        newDataValue.REPORTING_RATE_ON_TIME = this.calculateRate(newDataValue.ACTUAL_REPORTS_ON_TIME, newDataValue.EXPECTED_REPORTS);
        return newDataValue;
      });
    }

    return newReport;
  }

  recalculateReportData(compiledData, orgunitLevel) {
    if(compiledData) {
      compiledData.forEach(reportData => {
        const totalExpectedReport: number = reportData.data.filter(dataItem => { return dataItem.level !== orgunitLevel.toString() && dataItem.EXPECTED_REPORTS > 0}).length;
        const totalActualReport: number = reportData.data.filter(dataItem => { return dataItem.level !== orgunitLevel.toString() && dataItem.ACTUAL_REPORTS > 0}).length;
        const totalActualOnTimeReport: number = reportData.data.filter(dataItem => { return dataItem.level !== orgunitLevel.toString() && dataItem.ACTUAL_REPORTS_ON_TIME > 0}).length;
        reportData.data.forEach(dataValue => {
          dataValue.EXPECTED_REPORTS = dataValue.level === orgunitLevel.toString() && totalExpectedReport > 0 ? totalExpectedReport : dataValue.EXPECTED_REPORTS > 1 ? 1 : dataValue.EXPECTED_REPORTS;
          dataValue.ACTUAL_REPORTS = dataValue.level === orgunitLevel.toString() && totalActualReport > 0 ? totalActualReport : dataValue.ACTUAL_REPORTS > 1 ? 1 : dataValue.ACTUAL_REPORTS;
          dataValue.ACTUAL_REPORTS_ON_TIME = dataValue.level === orgunitLevel.toString() && totalActualOnTimeReport > 0 ? totalActualOnTimeReport : dataValue.ACTUAL_REPORTS_ON_TIME > 1 ? 1 : dataValue.ACTUAL_REPORTS_ON_TIME;
          dataValue.REPORTING_RATE = this.calculateRate(dataValue.ACTUAL_REPORTS, dataValue.EXPECTED_REPORTS);
          dataValue.REPORTING_RATE_ON_TIME = this.calculateRate(dataValue.ACTUAL_REPORTS_ON_TIME, dataValue.EXPECTED_REPORTS);
        })
      })
    }
    return compiledData
  }

  getPersonInCharge(combinedData, orgunitlevel) {
    let personInCharge: string = null;
    if(orgunitlevel === 2) {
      const levelTwoData = _.find(combinedData, ['level', 2]);

      if(levelTwoData) {
        const objectWithPIC = _.find(levelTwoData.data, ['level', orgunitlevel.toString()]);
        if(objectWithPIC) {personInCharge = objectWithPIC.personInCharge}
      } else {
        const objectWithPIC = _.find(combinedData[0].data, ['level', orgunitlevel.toString()]);
        if(objectWithPIC) {personInCharge = objectWithPIC.personInCharge}
      }

    }

    return personInCharge !== '' ? personInCharge : null;

  }

  sanitizeReportResult(result, canMerge): number {
    if(canMerge && result > 1) {
      return 1;
    }

    return result;
  }

  prepareDownloadableReport(reportData) {
    let downlodableReport: any[] = [];
    reportData.forEach(data => {
      downlodableReport.push({
        Name: data.name,
        Actual: data.ACTUAL_REPORTS,
        Expected: data.EXPECTED_REPORTS,
        PercentExpected: data.REPORTING_RATE,
        OnTime: data.ACTUAL_REPORTS_ON_TIME,
        PercentOnTime: data.REPORTING_RATE_ON_TIME
      })
    });

    reportData.downlodableReport = downlodableReport;
    return reportData;
  }

  loadExecutedReports(reportId): Observable<any> {
    return Observable.create(observer => {
      const report = this.executedReports[reportId];
      if(report !== undefined) {
        observer.next(report);
        observer.complete();
      } else {
        this.http.get('../../../api/dataStore/executed/' + reportId)
          .map((res: Response) => res.json())
          .catch(error => Observable.throw(new Error(error)))
          .subscribe(creationStatus => {
            this.executedReports[reportId] = creationStatus;
            observer.next(creationStatus);
            observer.complete()
          }, () => {
            this.executedReports[reportId] = null;
            observer.next(null);
            observer.complete()
          })
      }
    })
  }

  getCreationStatus(rows,reportParams, dataIndex): Observable<any> {
    return Observable.create(observer => {
      const totalRows = rows.length;
      let loadedResponse = 0;
      rows.forEach(row => {
        const reportId: string = reportParams.datasetId + '_' + row[dataIndex.uid] + '_' + reportParams.periodId;
        this.loadExecutedReports(reportId).subscribe(creationStatus => {
            if(creationStatus !== null) {
              row[dataIndex.completed] = 1;

              if(creationStatus.hasOwnProperty('creationDate')) {
                //logic for creation date
                if(this.dateDiff(new Date(reportParams.reportDate),new Date(creationStatus.creationDate)) >= 0) {
                  row[dataIndex.ontime] = 1;
                }
              }
            }
            loadedResponse++;
            if(loadedResponse == totalRows) {
              observer.next(rows);
              observer.complete();
            }
          });

      })
    })
  }

  dateDiff(date1, date2): number {
    let datediff = Math.abs(date1.getTime() - date2.getTime()); // difference
    return parseInt(((date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000)).toFixed(0))
  }
  compileDataBasedOnParent(data: any[]): any[] {

    const groupedData = _.groupBy(data,'parentName');
    const keys: any[] = _.keys(groupedData);
    let newData: any[] = [];
    let grandParent: string = '';
    if(keys.length > 0) {
      keys.forEach(key => {
          if(key != '') {
            const childrenData: any[] = groupedData[key];
            let actualCount: number = 0;
            let expectedCount: number = 0;
            let onTimeCount: number = 0;
            if(childrenData.length > 0) {
              childrenData.forEach(dataItem => {
                newData.push(dataItem);
                actualCount += parseInt(dataItem.ACTUAL_REPORTS);
                expectedCount += parseInt(dataItem.EXPECTED_REPORTS);
                onTimeCount += parseInt(dataItem.ACTUAL_REPORTS_ON_TIME);
                grandParent = dataItem.grandParent;
              });
            }

            if(key != grandParent) {
              newData.push({
                parentName: '',
                name: key,
                ACTUAL_REPORTS: actualCount,
                EXPECTED_REPORTS: expectedCount,
                REPORTING_RATE: this.calculateRate(actualCount, expectedCount),
                ACTUAL_REPORTS_ON_TIME: onTimeCount,
                REPORTING_RATE_ON_TIME: this.calculateRate(onTimeCount, expectedCount),
                focus: true
              })
            }
          }
      })
    }

    return newData.filter(dataItem => {return (dataItem.name != '' || dataItem.name != grandParent)});
  }

  calculateRate(numerator, denominator) {
    let rate: number = parseInt(denominator) != 0 ? parseInt(numerator)/parseInt(denominator)*100 : 0;

    return rate.toFixed(0);
  }

  private _getDataParameters(dataId, reportOptions): string {
    let param: string = '';
    if(reportOptions.length > 0) {
      reportOptions.forEach((optionValue, optionIndex) => {
        param += optionIndex > 0 ? ';' : '';
        param += dataId + '.' + optionValue
      })
    }
    return param;
  }

  private _getMetadataIdentifiersFromAnalytics(analyticResult: any): any {
    let identifiers: any = {};
    if(analyticResult.hasOwnProperty('headers') && analyticResult.hasOwnProperty('metaData')) {
      analyticResult.headers.forEach((headerItem, headerIndex) => {
        if(headerItem.name == 'value' && !identifiers.hasOwnProperty(headerItem.name)) {
          identifiers[headerItem.name] = {
            itemIndex: headerIndex,
          }
        }
        if(analyticResult.metaData.hasOwnProperty('dimensions')) {
          if(analyticResult.metaData.dimensions.hasOwnProperty(headerItem.name)) {
            identifiers[headerItem.name] = {
              itemIndex: headerIndex,
              items: analyticResult.metaData.dimensions[headerItem.name]
            }
          }
        } else {
          //TODO handle when there is no dimension
        }
      })
    } else {
      console.warn('no headers and/or metadata available')
    }
    return identifiers == {} ? null : identifiers ;
  }

  private _getMetadataName(metadataId, metadataItems): any {
    let name: string = '';
    if(metadataItems.hasOwnProperty(metadataId)) {
      name = metadataItems[metadataId].name;
    }
    return name;
  }


  private _getAvailableDataItem(data, orgUnitName): any {
    let dataItem: any = {};
    let index: number = -1;
    data.forEach((dataValue, dataIndex) => {
      if(dataValue.name == orgUnitName) {
        dataItem = dataValue;
        index = dataIndex;
      }
    });

    return {
      index: index,
      item: dataItem
    }
  }
  private _organizeDataFromAnalytics(identifiers: any, analyticResult: any): any[] {
    let data: any[] = [];
    if(identifiers != null) {
      if(analyticResult.hasOwnProperty('rows') && analyticResult.rows.length > 0) {
        if(identifiers.hasOwnProperty('ou') && identifiers.hasOwnProperty('dx')) {
          identifiers.ou.items.forEach(item => {
            let orgUnitName = this._getMetadataName(item, analyticResult.metaData.hasOwnProperty('items') ? analyticResult.metaData.items : {})
            if(data.length > 0) {
              let orgUnitAvailable : boolean = false;
              for(let dataValue of data) {
                if(dataValue.name == orgUnitName) {
                  orgUnitAvailable = true;
                  break;
                }
              }

              if(!orgUnitAvailable) {
                data.push({name: orgUnitName})
              }

              analyticResult.rows.forEach(row => {
                if(item == row[identifiers.ou.itemIndex]) {
                  let dataItem: any = this._getAvailableDataItem(data,orgUnitName);
                  if(dataItem.index != -1) {
                    if(identifiers.dx.items.indexOf(row[identifiers.dx.itemIndex]) != -1 && !dataItem.item.hasOwnProperty(row[identifiers.dx.itemIndex])) {
                      dataItem.item[row[identifiers.dx.itemIndex]] = parseFloat(row[identifiers.value.itemIndex]).toFixed(0);
                      data[dataItem.index] = dataItem.item;
                    }
                  }
                }
              });
            } else {
              data.push({name: orgUnitName});
            }
          })
        } else {
          console.warn('No orgUnit and/or data attributes');
        }
      } else {
        /**
         * Get just available orgnunits with no data
         */
        if(identifiers.hasOwnProperty('ou') && identifiers.ou.items.length > 0) {
          identifiers.ou.items.forEach(orgUnit => {
            data.push({
              name: this._getMetadataName(orgUnit, analyticResult.metaData.hasOwnProperty('items') ? analyticResult.metaData.items : {}),
            })
          })
        }
        //TODO find a way to deal with no row situation
        console.warn('analytic has no/empty row attribute')
      }
    } else {
      //TODO find a way to deal with empty identifiers
    }
    return data;
  }

}
