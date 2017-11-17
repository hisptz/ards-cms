import {Component, OnInit} from '@angular/core';
import {DocumentService} from '../../providers/document.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  documents: any;
  isError = false;
  loaderStyle = {width: '10px', height: '10px'};



  constructor(private documentService: DocumentService) {
  }

  ngOnInit() {
    this.documentService.getDocuments().subscribe(documents => {
      this.documents = documents;
    }, error => {
      this.isError = true;
    });
  }

  deleteDocument(document) {
    console.log(document);
  }

  hideDocument(document) {
    this.documents.map(documentItem => {
      if (documentItem.id === document.id) {
        documentItem.hidden = true;
      }
    });
  }

  showDocument(document) {

    this.documents.map(documentItem => {
      if (documentItem.id === document.id) {
        documentItem.hidden = false;
      }
    });

  }

}
