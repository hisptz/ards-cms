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
    largeWidth: '340px',
    hideWidth: '35px'
  };

  @ViewChild('analysis') analysis: ElementRef;
  @ViewChild('documents') documents: ElementRef;
  @ViewChild('links') links: ElementRef;

  @Output() onWidthChange: EventEmitter<string> = new EventEmitter<string>();

  currentWidth: any;
  currentPanel: string;
  hideMenu: boolean = false;
  isMaxSize: boolean = false;
  isMinSize: boolean = false;

  constructor(private renderer: Renderer) {}

  ngOnInit() {
    this.currentWidth = this.sidebarConfiguration.normalWidth;
    this.currentPanel = 'dataAnalysis';
  }

  resize(resizeOption) {
    console.log(resizeOption);

    if (resizeOption == 'minimize') {
      if (this.currentWidth == this.sidebarConfiguration.normalWidth) {
        this.currentWidth = this.sidebarConfiguration.hideWidth;
        this.isMinSize = true;
        this.isMaxSize = false;
        this.hideMenu = true;
      } else {
        this.currentWidth = this.sidebarConfiguration.normalWidth;
        this.isMinSize = false;
        this.isMaxSize = false;
        this.hideMenu = false;
      }
    } else if (resizeOption == 'expand') {
      if (this.currentWidth == this.sidebarConfiguration.normalWidth) {
        this.currentWidth = this.sidebarConfiguration.largeWidth;
        this.isMinSize = false;
        this.isMaxSize = true;
        this.hideMenu = false;
      } else {
        this.currentWidth = this.sidebarConfiguration.normalWidth;
        this.isMinSize = false;
        this.isMaxSize = false;
        this.hideMenu = false;
      }
    }
  }
  getArrowLeftWidth(currentWidth) {
    const width = parseInt(currentWidth.slice(0, -2));
    const newWidth = width > 40 ? width - 40 : 5;
    return newWidth + 'px';
  }

  onTogglePanel(panelName, event) {
    if (event) {
      event.stopPropagation();
    }
    this.currentPanel = this.currentPanel != panelName ? panelName : '';
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
