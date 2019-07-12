import { Component, OnInit } from '@angular/core';
import { ReportTableService } from '../../providers/report-table.service';

@Component({
  selector: 'app-report-tables',
  templateUrl: './report-tables.component.html',
  styleUrls: ['./report-tables.component.css']
})
export class ReportTablesComponent implements OnInit {
  reportTables: any = null;
  isError = false;
  loaderStyle = { width: '10px', height: '10px' };
  constructor(private reportTable: ReportTableService) {}

  ngOnInit() {
    this.reportTable.getReportTables().subscribe(
      reportTables => {
        this.reportTables = reportTables;
      },
      error => {
        this.isError = true;
      }
    );
  }

  collapseData(reportTableId) {
    this.reportTables.map(reportTable => {
      if (reportTable.id === reportTableId) {
        reportTable.state = !reportTable.state;
      } else {
        reportTable.state = false;
      }
    });
  }
}
