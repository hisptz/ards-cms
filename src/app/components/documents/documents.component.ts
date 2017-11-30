import {Component, OnInit} from '@angular/core';
import {DocumentService} from '../../providers/document.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  documents: any;
  isError = false;
  loaderStyle = {width: '10px', height: '10px'};
  loading = true;
  message = 'loading';

  constructor(private documentService: DocumentService) {
  }

  ngOnInit() {
    this.loadDocument();
  }

  previewDocument(document, event) {
    event.preventDefault();
    const win = window.open(document, '_blank');
  }

  deleteDocument(document) {
    this.message = 'deleting';
    this.loading = true;
    this.documentService.deleteDocuments(document.id).subscribe(response => {
      if (response.statusText === 'OK') {
        this.loadDocument();
      }
    })
  }

  onDocumentUploadedSuccessfull($event) {
    if ($event.uploaded) {
      this.loadDocument();
    }

  }

  loadDocument() {
    this.loading = true;
    this.message = 'loading';
    this.documentService.getDocuments().subscribe(documents => {
      this.documents = documents;
      this.loading = false;
      this.isError = false;
    }, error => {
      this.isError = true;
    });
  }

  hideDocument(document) {
    this.loading = true;
    this.message = 'hidding';
    const newList = _.clone(this.documents);
    newList.map(documentItem => {
      if (documentItem.id === document.id) {
        documentItem.hidden = true;
      }
    });

    this.documentService.updateDataStoreDocuments(newList).subscribe(response => {
      this.loading = false;
      this.loadDocument();
    })
  }

  showDocument(document) {
    this.loading = true;
    this.message = 'showing';
    const newList = _.clone(this.documents);
    newList.map(documentItem => {
      if (documentItem.id === document.id) {
        documentItem.hidden = false;
      }
    });

    this.documentService.updateDataStoreDocuments(newList).subscribe(response => {
      this.loading = false;
      this.loadDocument();
    })

  }

}
