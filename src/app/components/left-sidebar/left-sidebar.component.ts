import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  Renderer
} from '@angular/core';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  sidebarConfiguration: any = {
    normalWidth: '300px',
    largeWidth: '300px',
    hideWidth: '5px'
  };

  @ViewChild('analysis') analysis: ElementRef;
  @ViewChild('documents') documents: ElementRef;
  @ViewChild('links') links: ElementRef;

  @Output() onWidthChange: EventEmitter<string> = new EventEmitter<string>();

  currentWidth: any;
  hideMenu: boolean = false;
  isMaxSize: boolean = false;
  isMinSize: boolean = false;

  constructor(private renderer: Renderer) {}

  ngOnInit() {
    this.currentWidth = this.sidebarConfiguration.normalWidth;
  }

  resize(resizeOption) {
    if (resizeOption == 'expand') {
      if (this.currentWidth == this.sidebarConfiguration.hideWidth) {
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
    } else if (resizeOption == 'minimize') {
      if (this.currentWidth == this.sidebarConfiguration.largeWidth) {
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
    return newWidth + 'px';
  }

  clickAccordon(menu, event) {
    event.preventDefault();
    const action = new MouseEvent('click', { bubbles: true });
    if (event.target.localName !== 'a') {
      this.renderer.invokeElementMethod(
        this[menu].nativeElement,
        'dispatchEvent',
        [action]
      );
    }
  }

  checkEdge($event) {
    var sidebar = document.getElementById('sidebar');
    // console.log(sidebar.scrollTop, sidebar.scrollHeight);
    if (sidebar.scrollTop >= sidebar.offsetHeight / 2) {
      sidebar.scrollTop = 20;
    }
  }
}
