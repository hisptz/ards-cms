import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {HomeMenuService} from "../../providers/homeMenus.service";
@Component({
  selector: 'app-home-page-menu-update',
  templateUrl: './home-page-menu-update.component.html',
  styleUrls: ['./home-page-menu-update.component.css']
})
export class HomePageMenuUpdateComponent implements OnInit {
  @Input() menu: any;
  @Input() menuList: any;
  @Output() cancelUpdateEvent = new EventEmitter;
  actionLoading = false;
  actionLoadingMessage = "";

  constructor(private homePageMenus: HomeMenuService) {

  }

  ngOnInit() {
  }

  updateMenu(value) {
    this.actionLoading = true;
    this.actionLoadingMessage = "Updating home page menu, please wait ...";
    const menuListClone = _.clone(this.menuList);
    let newMenuList = [];
    if (menuListClone) {
      menuListClone.filter(menu => {
        return menu === this.menu ? newMenuList.push(value) : newMenuList.push(menu);
      });
    }

    this.homePageMenus.saveMenu(newMenuList).subscribe(response => {
      this.actionLoading = false;
      this.cancelUpdateEvent.emit({load: true});
    });
  }

  cancelMenuUpdate() {
    this.cancelUpdateEvent.emit();
  }

}
