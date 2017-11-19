import {Component, OnInit} from '@angular/core';
import {HomeMenuService} from "../providers/homeMenus.service";
import * as _ from 'lodash';
@Component({
  selector: 'app-home-menus',
  templateUrl: './home-menus.component.html',
  styleUrls: ['./home-menus.component.css']
})
export class HomeMenusComponent implements OnInit {
  menuList: any;
  actionLoading = true;
  actionError = true;
  actionLoadingMessage = 'Loading home page menu , please wait ...';
  currentModifiedMenu: any;
  showAddForm = false;
  showEditForm = false;

  constructor(private homeMenuService: HomeMenuService) {
    this.getMenus();
  }

  ngOnInit() {
  }


  getMenus() {
    this.actionLoading = true;
    this.actionLoadingMessage = 'Loading home page menu , please wait ...';
    this.homeMenuService.getHomeMenus().subscribe(menus => {
      this.actionLoading = false;
      this.menuList = menus;
    });
  }

  onEditHomeMenuEvent($event) {
    this.currentModifiedMenu = $event;
    this.showEditForm = true;
    let menuListClone = _.clone(this.menuList);

  }

  onCancelUpdateEvent() {
    this.showEditForm = false;
    this.currentModifiedMenu = null;
  }

  onDeleteHomeMenuEvent($event) {
    this.currentModifiedMenu = $event;

  }

  updateMenuList(updatedMenu, originalMenu) {
    const menuListClone = _.clone(this.menuList);
    let newMenuList = [];
    if (menuListClone.length > 0) {
      newMenuList = menuListClone.filter(menu => {
        if (menu === originalMenu) {
          return updatedMenu;
        } else {
          return menu;
        }
      });
      this.menuList = newMenuList;
    }

  }

}
