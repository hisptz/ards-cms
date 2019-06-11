import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DocumentService } from "../../providers/document.service";

@Component({
  selector: "app-document-update",
  templateUrl: "./document-update.component.html",
  styleUrls: ["./document-update.component.css"]
})
export class DocumentUpdateComponent implements OnInit {
  documentName: any;
  documentFile: any;
  loading = false;
  errorMessage: any;
  error = false;
  fileValue: any;
  isAttached: any;
  @Output() documentUploadedSuccessfull = new EventEmitter();

  constructor(
    private elem: ElementRef,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    const newDate = new Date();
    const eventDate =
      newDate.getFullYear() +
      "-" +
      newDate.getMonth() +
      "-" +
      newDate.getDate();
    // console.log(eventDate);
  }

  uploadDocument() {
    if (this.documentName !== "") {
      this.loading = true;
      this.documentUploadedSuccessfull.emit(!this.loading);
      let file = this.elem.nativeElement.querySelector("#file_selector")
        .files[0];
      const formData = new FormData();
      formData.append("upload", file, file.name);
      formData.append("name", this.documentName);
      formData.append("id", "");
      formData.append("url", "http://");
      formData.append("external", "false");
      formData.append("attachment", this.isAttached);
      this.documentName = "";
      this.documentFile = null;

      this.documentService.saveDocument(formData).subscribe(
        documentResponse => {
          this.documentUploadedSuccessfull.emit({ uploaded: true });
          this.errorMessage = "file upload failed";
          this.error = true;
          this.loading = false;
        },
        error => {
          this.errorMessage = "file upload failed";
          this.error = true;
          this.loading = false;
        }
      );
    }
  }

  updateFileSelected($event) {}

  uploadFile() {
    // let files = this.elem.nativeElement.querySelector('#file_selector').files;
    // console.log(this.elem.nativeElement);
  }
}
