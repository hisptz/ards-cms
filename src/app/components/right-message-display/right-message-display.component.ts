import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-right-message-display',
  templateUrl: './right-message-display.component.html',
  styleUrls: ['./right-message-display.component.css']
})
export class RightMessageDisplayComponent implements OnInit {
  @Input() message;
  constructor() {}

  ngOnInit() {}
}
