import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-menu',
  templateUrl: './control-menu.component.html',
  styleUrls: ['./control-menu.component.css']
})
export class ControlMenuComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  switchPage() {
    const win = window.open(
      '../../../api/apps/ARDS-HOME/index.html#/',
      '_self'
    );
  }
}
