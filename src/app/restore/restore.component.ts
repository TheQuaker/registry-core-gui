import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';

import {RestoreService} from '../services/restore.service';


@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html'
})

export class RestoreComponent implements OnInit {

  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  // public loaded: number = 0;
  total: number = 0;
  loaded: number = 0;


  file: FileList = null;

  constructor(
    private restoreService: RestoreService
  ) {}

  ngOnInit() {}

  selectFile(event) {
    // this.uploadFile(event.target.files);
    this.file = event.target.files;
  }

  uploadFile() {
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
          console.log('Upload Error:', err);
        }, () => {
          console.log('Upload done');
        }
      );
  }
}
