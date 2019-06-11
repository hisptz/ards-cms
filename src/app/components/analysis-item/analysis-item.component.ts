import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
@Component({
  selector: "analysis-item",
  templateUrl: "./analysis-item.component.html",
  styleUrls: ["./analysis-item.component.css"]
})
export class AnalysisItemComponent implements OnInit {
  @Input() reportTableContent;

  @Input() routerParams: any;

  isError = false;
  errorMessage: string = "";
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const analysisGroup = this.routerParams.analysisGroup;
    const analysisItemName = this.routerParams.analysisItemName;
    const analysisItemId = this.routerParams.analysisItemId;
  }
}
