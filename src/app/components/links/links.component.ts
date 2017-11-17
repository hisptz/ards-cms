import {Component, OnInit} from '@angular/core';
import {LinkService} from '../../providers/link.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {

  links: any;
  isError = false;
  loaderStyle = {width: '10px', height: '10px'};
  actionLoading = {actionMessage: '', isHappening: false};
  updatedLink: any;

  constructor(private linkService: LinkService) {
  }

  ngOnInit() {
    this.loadLinks();
  }


  onLinkUpdatedEvent() {
    this.loadLinks();
  }

  onUpdateCancelledEvent() {
    this.updatedLink = null;
  }

  loadLinks() {
    this.linkService.getLinks().subscribe(links => {
      this.links = links;
    }, error => {
      this.isError = true;
    });
  }

  deleteLink(Link) {
    let newLinks = [];
    this.actionLoading.actionMessage = 'Deleting link';
    this.actionLoading.isHappening = true;
    newLinks = this.links.filter(linkItem => {
      if (linkItem.id !== Link.id) {
        return linkItem;
      }
    });
    this.linkService.saveLink(newLinks).subscribe(response => {
      this.loadLinks();
      this.actionLoading.isHappening = false;
    });
  }

  editLink(link) {
    console.log(this.updatedLink);
    this.updatedLink = link;
    console.log(this.updatedLink);
  }

  redirectLink(link, event) {
    event.preventDefault();
    const win = window.open(link, '_blank');

  }

  hideLink(Link) {
    this.showLink(Link, 'Hidding link');
  }

  showLink(Link, message = 'Making link visible') {

    const links = _.clone(this.links);
    links.filter(linkItem => {
      if (linkItem.id === Link.id) {
        linkItem.hidden = !linkItem.hidden;
      }
    });
    this.actionLoading.actionMessage = message;
    this.actionLoading.isHappening = true;

    this.linkService.saveLink(links).subscribe(response => {
      this.loadLinks();
      this.actionLoading.isHappening = false;
    });

  }

}
