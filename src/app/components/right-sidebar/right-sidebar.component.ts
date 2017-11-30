import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {MessageService} from "../../providers/message.service";
import * as _ from 'lodash';

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
  messages: any;
  loading = true;
  loadingChart = true;
  charts = {all: null, selected: null};

  constructor(private messageService: MessageService) {
  }

  ngOnInit() {
    this.currentWidth = this.sidebarConfiguration.normalWidth;
    this.getMessages();
  }

  getMessages() {
    this.loading = true;
    this.messageService.getMessages().subscribe((messages) => {
      this.messages = this.refineMessages(messages);
      this.loading = false;
    })
  }

  refineMessages(messages) {
    const newMessagesList = [];
    const properties = Object.getOwnPropertyNames(messages);

    properties.forEach(messageId => {
      newMessagesList.push(messages[messageId]);
    })

    return newMessagesList;
  }

  onSelectedChartUpdated($event) {
    this.charts = this.refineCharts($event);
  }
  onloadingChart($event) {
    this.loadingChart = $event;
  }

  refineCharts(charts) {
    const newPair = {all: charts.all, selected: []};
    charts.selected.forEach(chart => {
      const chartIndex = _.findIndex(charts.all,['id',chart]);
      console.log(chartIndex, chart, charts.all)
      if(chartIndex>=0){
        newPair.selected.push({
          id:chart,
          name: charts.all[chartIndex].name,
          state:false
        })
      }
    });
    newPair.selected[0]?newPair.selected[0].state = true:null;
    return newPair;
  }

  resize(resizeOption) {
    if (resizeOption === 'expand') {
      if (this.currentWidth === this.sidebarConfiguration.hideWidth) {
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
    } else if (resizeOption === 'minimize') {
      if (this.currentWidth === this.sidebarConfiguration.largeWidth) {
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
    const width = parseInt(currentWidth.slice(0, -2));
    const newWidth = width > 40 ? width - 40 : 5;
    return newWidth + 'px'
  }


}
