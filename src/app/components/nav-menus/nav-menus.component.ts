import {Component, Input, OnInit} from '@angular/core';
import {HomeMenuService} from '../../providers/homeMenus.service';

@Component({
  selector: 'app-nav-menus',
  templateUrl: './nav-menus.component.html',
  styleUrls: ['./nav-menus.component.css']
})

export class NavMenusComponent implements OnInit {

  @Input() menus: any;

  constructor() {
  }

  ngOnInit() {
  }
}
