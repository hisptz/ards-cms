import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-control-menu",
  templateUrl: "./control-menu.component.html",
  styleUrls: ["./control-menu.component.css"]
})
export class ControlMenuComponent implements OnInit {
  showAppControlMenu: boolean = true;
  constructor(private router: Router) {
    console.log();
  }

  ngOnInit() {}

  switchPage() {
    const win = window.open("../../../api/apps/home/index.html#/", "_self");
    this.router.events.subscribe(val => {
      // see also
      console.log(val);
    });
  }
}
