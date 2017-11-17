import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-document-update',
  templateUrl: './document-update.component.html',
  styleUrls: ['./document-update.component.css']
})
export class DocumentUpdateComponent implements OnInit {


  addForm = new FormGroup({
    documentName: new FormControl(),
    document: new FormControl()
  });

  formData: FormData = new FormData();

  fileValue: any;

  constructor() {
  }

  ngOnInit() {
  }


  uploadDocument(addForm) {
    console.log(addForm);
    console.log(addForm.value);
    this.formData.append('documentName', 'test');
    console.log(this.formData);
  }

  updateFileSelected(event) {
    const files = event.target.files;
    if (files.length > 0) {

      this.formData.append('document', files[0], files[0].name);

    }
  }

  uploadFile() {
    const photo: any = document.getElementById('addForm');
    // the file is the first element in the files property
    const file = photo.files[0];

    console.log('File name: ' + file.fileName);
    console.log('File size: ' + file.fileSize);

    return false;
  }

}
