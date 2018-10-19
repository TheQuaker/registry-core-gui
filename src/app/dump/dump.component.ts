import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {Router} from '@angular/router';

import {BsModalRef, BsModalService} from 'ngx-bootstrap';

import {ResourceTypeService} from '../services/resource-type.service';
import {SearchService} from '../services/search.service';
import {DumpService} from '../services/dump.service';
import {ResourceType} from '../domain/resource-type';
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-dump',
  templateUrl: './dump.component.html'
})

export class DumpComponent implements OnInit {

  dumpForm: FormGroup;
  public resourceTypeSelector: ResourceType[];
  public resourceTypeNameArray: string[];
  public errorMessage: string;
  file;

  @ViewChild('statusModal')
  public statusModal: TemplateRef<any>;
  @ViewChild('errorModal')
  public errorModal: TemplateRef<any>;

  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  total = 0;
  loaded = 0;
  loading_ = false;
  // modal
  modalRef: BsModalRef;

  constructor(
    private resourceTypeService: ResourceTypeService,
    private dumpService: DumpService,
    private search: SearchService,
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.search.nextTitle = 'Dump Control';
    this.search.showField = true; // true means don't show ;)
    this.getResourceTypes();
    this.dumpForm = this.fb.group({
      raw: ['false'],
      schema: ['false'],
      version: ['false'],
      resourceTypes: this.fb.array([])
    });
  }

  getResourceTypes() { // backend call
    this.resourceTypeService.getResourceTypes().subscribe(
      resourceTypePage => this.resourceTypeSelector = resourceTypePage.results,
      error => this.errorMessage = <any>error,
      () => {
        this.resourceTypeNameArray = [];
        for (let i = 0; i < this.resourceTypeSelector.length; i++) {
          this.resourceTypeNameArray.push(this.resourceTypeSelector[i].name);
        }
        this.resourceTypeNameArray.sort((a, b) => 0 - (a > b ? -1 : 1));
      }
    );
  }

  get resourceTypes() { // return form resource types as array
    return this.dumpForm.get('resourceTypes') as FormArray;
  }

  removeField(i) {
    let j = 0;
    while (j < this.resourceTypes.length) {
      if (this.resourceTypes.value[j] === i.value) {
        break;
      }
      j++;
    }
    // console.log(i.value);
    // console.log(j);
    this.resourceTypes.removeAt(j);
    this.resourceTypeNameArray.push(i.value);
    this.resourceTypeNameArray.sort((a, b) => 0 - (a > b ? -1 : 1));
  }

  onTypeSelect(event): void {
    this.resourceTypes.push(this.fb.control({value: event.target.value, disabled: true}));
    // this.resourceTypes.push(this.fb.control(event.target.value));

    const i = this.resourceTypeNameArray.indexOf(event.target.value, 0);
    // console.log(this.resourceTypeNameArray);
    // console.log(i);
    if (i > -1) {
      this.resourceTypeNameArray.splice(i, 1);
    }
    event.target.value = 'null';
  }

  download() {
    //   const url_: URL = new URL(dumpUrl + '?' + params);
    //   const path = url_.pathname.split(/\//);
    //   const filename = url_.searchParams.get('archiveId') || path[path.length - 1] || 'download';
    this.total = 0;
    this.loaded = 0;
    const filename = 'download';
    this.loading_ = true;
    this.loading.next(true);
    this.openModal(this.statusModal);
    this.dumpService.downloadDump(
      this.dumpForm.get('raw').value,
      this.dumpForm.get('schema').value,
      this.dumpForm.get('version').value,
      this.dumpForm.get('resourceTypes').value)
      .subscribe(event => {
          if (event.type === HttpEventType.DownloadProgress) {
            this.total = event.total;
            this.loaded = event.loaded;
            // console.log(event.total, event.loaded);
          } else if (event instanceof HttpResponse) {
            this.loading_ = false;
            // this.total = 0; this.loaded = 0;
            this.loading.next(false);
            const blob = (event as HttpResponse<any>).body;
            saveAs(blob, filename + '.zip');
          }
        },
        (err) => {
        this.modalRef.hide();
        this.openModal(this.errorModal);
          console.log('Download Error: ', err);
        },
        () => {
        this.modalRef.hide();
          console.log('Download complete');
        }
      );
  }

  // goBack() {
  //   this.router.navigate(['']);
  // }

  /** Modal  */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

}
