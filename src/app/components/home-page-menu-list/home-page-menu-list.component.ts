import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-home-page-menu-list',
  templateUrl: './home-page-menu-list.component.html',
  styleUrls: ['./home-page-menu-list.component.css']
})
export class HomePageMenuListComponent implements OnInit {
  @Input() menuList: any;
  @Input() actionLoadingMessage: string;
  @Input() actionLoading: boolean;
  @Input() actionError: boolean;
  @Output() editHomeMenuEvent = new EventEmitter;
  @Output() deleteHomeMenuEvent = new EventEmitter;

  constructor() {
  }

  ngOnInit() {
  }

  editHomeMenu(homeMenu) {
    this.editHomeMenuEvent.emit(homeMenu);
  }

  deleteHomeMenu(homeMenu) {
    this.deleteHomeMenuEvent.emit(homeMenu);
  }

}
