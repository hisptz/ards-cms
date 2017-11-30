import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-charts-display',
  templateUrl: './charts-display.component.html',
  styleUrls: ['./charts-display.component.css']
})
export class ChartsDisplayComponent implements OnInit {
  @Input() charts;
  @Input() selectedCharts;
  @Input() loading;

  constructor() {
  }

  ngOnInit() {
    console.log(this.charts)
  }

  collapseData(chart) {
    this.selectedCharts.forEach(selected => {
      chart.id === selected.id ? selected.state = !selected.state : selected.state = false;
    });
  }

}
