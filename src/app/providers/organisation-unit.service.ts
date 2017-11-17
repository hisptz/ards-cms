import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class OrganisationUnitService {

  constructor(private http: Http) { }

  public getUserOrganisationUnits() {

  }

  getOrgunitLevels (): Observable<any> {
    return this.http.get('../../../api/organisationUnitLevels.json?fields=id,name,level&order=level:asc?paging=false')
      .map((response: Response) => response.json())
      .catch(error => Observable.throw(new Error(error)));
  }

  getOrgunitGroups (): Observable<any> {
    return this.http.get('../../../api/organisationUnitGroups.json?fields=id,name&paging=false')
      .map((response: Response) => response.json())
      .catch(error => Observable.throw(new Error(error)));
  }

  getOrgunits(url: string): Observable<any> {
    return this.http.get(url)
      .map((response: Response) => response.json())
      .catch(error => Observable.throw(new Error(error)));
  }

}
