import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {LinkService} from '../../providers/link.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-links-update',
  templateUrl: './links-update.component.html',
  styleUrls: ['./links-update.component.css']
})
export class LinksUpdateComponent implements OnInit {
  addForm = new FormGroup({
    name: new FormControl(),
    url: new FormControl()
  });

  editForm = new FormGroup({
    name: new FormControl(),
    url: new FormControl()
  });


  @Input() links;
  @Input() updatedLink;
  @Output() linkUpdated = new EventEmitter;
  @Output() updateCancelled = new EventEmitter;
  actionLoading = {actionMessage: '', isHappening: false};


  constructor(private linkService: LinkService) {
  }

  ngOnInit() {
  }

  get isValidLinkName() {
    return this.addForm.controls['name'].valid;
  }

  get isValidLinkUrl() {
    return this.addForm.controls['url'].valid;
  }

  saveLink() {
    const newLinks = _.clone(this.links);
    this.actionLoading.actionMessage = 'Adding new link';
    this.actionLoading.isHappening = true;

    newLinks.push({
      id: newLinks.length,
      marker: '<i class=\'fa fa-globe\'></i>',
      name: this.addForm.value.name,
      url: this.addForm.value.url,
      hidden: false
    });


    this.linkService.saveLink(newLinks).subscribe(response => {
      this.addForm.reset({name: null, url: null});
      this.linkUpdated.emit();
      this.actionLoading.isHappening = false;
      this.links = newLinks;
    });
  }

  updateLink(updatedLink) {
    updatedLink.name = this.editForm.value.name ? this.editForm.value.name : updatedLink.name;
    updatedLink.url = this.editForm.value.url ? this.editForm.value.url : updatedLink.url;

    this.actionLoading.actionMessage = 'Updating link';
    this.actionLoading.isHappening = true;

    const copyOfLinks = _.clone(this.links);
    const links = copyOfLinks.filter(linkItem => {
      if (linkItem.id === updatedLink.id) {
        return updatedLink;
      } else {
        return linkItem;
      }
    });

    this.linkService.saveLink(links).subscribe(response => {
      this.editForm.reset({name: null, url: null});
      this.linkUpdated.emit();
      this.actionLoading.isHappening = false;
      this.links = links;
    });

  }

  cancelUpdate() {
    this.updateCancelled.emit();
  }

}
