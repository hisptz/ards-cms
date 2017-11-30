import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable, Subscription} from "rxjs";
import * as _ from 'lodash';

@Injectable()
export class ChartService {

  subscription: Subscription = new Subscription();
  executedReports: any = {};

  constructor(private http: Http) {
  }

  getSystemCharts(): Observable<any> {
    return Observable.create(observer => {
      this.http.get('../../../api/charts.json?paging=false')
        .map((res: Response) => res.json())
        .catch((error) => Observable.throw(new Error(error)))
        .subscribe((response: any) => {
          observer.next(this._refineCharts(response));
          observer.complete();
        }, dataSetError => {
          observer.error(dataSetError);
        })
    })
  }


  updateStoreCharts(charts): Observable<any> {
    return Observable.create(observer => {
      this.http.put('../../../api/dataStore/chartsStorage/selectedCharts', charts)
        .map((res: Response) => res.json())
        .catch((error) => Observable.throw(new Error(error)))
        .subscribe((response: any) => {
          observer.next(response);
          observer.complete();
        }, dataSetError => {
          observer.error(dataSetError);
        })
    })
  }


  getDataStoreCharts(): Observable<any> {
    return Observable.create(observer => {
      this.http.get('../../../api/dataStore/chartsStorage/selectedCharts')
        .map((res: Response) => res.json())
        .catch((error) => Observable.throw(new Error(error)))
        .subscribe((response: any) => {
          observer.next(this._refineSelected(response));
          observer.complete();
        }, dataSetError => {
          observer.error(dataSetError);
        })
    })
  }

  _refineCharts(charts){
    let newCarts = [];
    if(charts){
      charts.charts.forEach(chart=>{
        newCarts.push({id:chart.id, name:chart.displayName,displayName:chart.displayName})
      })
    }
    return newCarts;
  }
  _refineSelected(charts){
    let newCarts = [];
    if(charts){
      charts.forEach(chart=>{
        newCarts.push(chart.id)
      })
    }
    return newCarts;
  }

}
