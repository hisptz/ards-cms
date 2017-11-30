import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-menu',
  templateUrl: './control-menu.component.html',
  styleUrls: ['./control-menu.component.css']
})
export class ControlMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  switchPage(){
    const win = window.open('../../../api/apps/home/index.html#/','_self');
  }

}
