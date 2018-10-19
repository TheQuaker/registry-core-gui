import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';

import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {RestoreService} from '../services/restore.service';
import {SearchService} from '../services/search.service';


@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html'
})

export class RestoreComponent implements OnInit {

  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('statusModal')
  public statusModal: TemplateRef<any>;
  @ViewChild('errorModal')
  public errorModal: TemplateRef<any>;

  // modal
  modalRef: BsModalRef;

  total = 0;
  loaded = 0;
  file: FileList = null;

  constructor(
    private modalService: BsModalService,
    private restoreService: RestoreService,
    private search: SearchService
  ) {}

  ngOnInit() {
    this.search.nextTitle = 'Restore Control';
    this.search.showField = true; // true means don't show ;)
  }

  selectFile(event) {
    // this.uploadFile(event.target.files);
    this.file = event.target.files;
  }

  uploadFile() {
    this.openModal(this.statusModal);
    if (this.file === null) {
      console.log('No file selected!');
      return;
    }
    const file: File = this.file[0];

    this.loading.next(true);
    this.restoreService.restore(file)
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.total = event.total; this.loaded = event.loaded;
            // this.loaded = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${(this.loaded / this.total) * 100}% loaded.`);
          } else if (event instanceof HttpResponse) {
            this.loading.next(false);
            console.log('File is completely loaded!');
          }
        },
        (err) => {
          this.modalRef.hide();
          this.openModal(this.errorModal);
          console.log('Upload Error:', err);
        }, () => {
          this.modalRef.hide();
          console.log('Upload done');
        }
      );
  }

  /** Modal  */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
}
