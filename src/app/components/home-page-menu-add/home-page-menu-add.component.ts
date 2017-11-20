import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HomeMenuService} from "../../providers/homeMenus.service";
import * as _ from 'lodash';
@Component({
  selector: 'app-home-page-menu-add',
  templateUrl: './home-page-menu-add.component.html',
  styleUrls: ['./home-page-menu-add.component.css']
})
export class HomePageMenuAddComponent implements OnInit {
  @Input() menu: any;
  @Input() menuList: any;
  @Output() cancelUpdateEvent = new EventEmitter;
  actionLoading = false;
  actionLoadingMessage = "";

  constructor(private homePageMenus: HomeMenuService) {

  }

  ngOnInit() {
  }

  addMenu(value) {
    this.actionLoading = true;
    this.actionLoadingMessage = "Adding home page menu, please wait ...";
    let menuListClone = _.clone(this.menuList);

    if (menuListClone) {
      menuListClone.push(value);
    } else {
      menuListClone = [];
      menuListClone.push(value);
    }

    this.homePageMenus.saveMenu(menuListClone).subscribe(response => {
      this.actionLoading = false;
      this.cancelUpdateEvent.emit({load: true});
    });
  }

  cancelMenuAdd() {
    this.cancelUpdateEvent.emit();
  }


}
