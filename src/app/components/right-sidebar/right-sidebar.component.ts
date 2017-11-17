import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent implements OnInit {

  sidebarConfiguration: any = {
    normalWidth: '300px',
    largeWidth: '300px',
    hideWidth: '5px',
  }

  @Output() onWidthChange: EventEmitter<string> = new EventEmitter<string>();

  currentWidth: any;
  hideMenu: boolean = false;
  isMaxSize: boolean = false;
  isMinSize: boolean = false;
  constructor() { }

  ngOnInit() {
    this.currentWidth = this.sidebarConfiguration.normalWidth;
  }

  resize(resizeOption) {
    if(resizeOption === 'expand') {
      if(this.currentWidth === this.sidebarConfiguration.hideWidth) {
        this.isMaxSize = false;
        this.isMinSize = false;
        this.hideMenu = false;
        this.currentWidth = this.sidebarConfiguration.normalWidth;
      } else {
        this.hideMenu = false;
        this.isMaxSize = true;
        this.isMinSize = false;
        this.currentWidth = this.sidebarConfiguration.largeWidth;
      }
    } else if(resizeOption === 'minimize') {
      if(this.currentWidth === this.sidebarConfiguration.largeWidth) {
        this.isMaxSize = false;
        this.isMinSize = false;
        this.hideMenu = false;
        this.currentWidth = this.sidebarConfiguration.normalWidth;
      } else {
        this.isMaxSize = false;
        this.isMinSize = true;
        this.currentWidth = this.sidebarConfiguration.hideWidth;
        this.hideMenu = true;
      }

    }

    this.onWidthChange.emit(this.currentWidth);
  }
  getArrowLeftWidth(currentWidth) {
    const width = parseInt(currentWidth.slice(0,-2));
    const newWidth = width > 40 ? width - 40 : 5;
    return newWidth + 'px'
  }

}
