import {Component, OnInit} from '@angular/core';
import {Http, Response} from '@angular/http';
import {error} from 'util';
import 'rxjs/Rx';

@Component({
  selector: 'app-ards-menu',
  templateUrl: './ards-menu.component.html',
  styleUrls: ['./ards-menu.component.css']
})
export class ArdsMenuComponent implements OnInit {
  fileUrl = '../../..';
  objectName: any
  menus: any = {};
  public isHeaderLoaded: boolean = false;

  constructor(private http: Http) {
  }

  ngOnInit() {
    const url = this.fileUrl + '/dhis-web-commons/menu/getModules.action';
    this.http.get(this.fileUrl + '/api/me.json')
      .map((res: Response) => res.json())
      .subscribe(response => {
          this.objectName = response
          this.http.get(url)
            .map((res: Response) => res.json())
            .subscribe(data => {
              for (const menu of data.modules) {
                this.menus[menu.name] = true;
              }
              console.log(this.objectName);
              this.isHeaderLoaded = true;
            });
        }, error => {

        }
      );


  }

}
