import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ReportTableService } from "../../providers/report-table.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
import { Observable } from "rxjs";
@Component({
  selector: "analysis-dropdown",
  templateUrl: "./analysis-dropdown.component.html",
  styleUrls: ["./analysis-dropdown.component.css"]
})
export class AnalysisDropdownComponent {
  reportTableContent: any;

  constructor() {}
}
