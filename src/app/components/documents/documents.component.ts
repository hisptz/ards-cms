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
  loading = true;
  message = 'loading';
  constructor(private documentService: DocumentService) {
  }

  ngOnInit() {
    this.loadDocument();
  }

  deleteDocument(document) {
    this.message = 'deleting';
    this.loading = true;
    this.documentService.deleteDocuments(document.id).subscribe(response=>{
      if (response.statusText === 'OK')
      {
        this.loadDocument();
      }
    })
  }

  onDocumentUploadedSuccessfull($event) {
    if ($event.uploaded){
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
