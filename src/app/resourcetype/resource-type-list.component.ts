import {ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

import {PageChangedEvent} from 'ngx-bootstrap';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceTypePage} from '../domain/resource-type-page';
import {ResourceType} from '../domain/resource-type';


@Component({
  selector: 'app-resource-type-list',
  templateUrl: './resource-type-list.component.html',
  styleUrls: ['./resource-type-list.component.css']
})

export class ResourceTypeListComponent implements OnInit {

  @ViewChild('masterCheckbox')
  public masterCheckbox: ElementRef;

  @ViewChild('table')
  public table: ElementRef;

  @ViewChildren('checkBoxes')
  public checkBoxes: QueryList<ElementRef>;

  public resourceTypePage: ResourceTypePage;
  public errorMessage: string;
  public isDisabled = true;
  // pagination
  public viewPage: ResourceType[];
  rotate = true;
  showBoundaryLinks = true;
  maxSize = 5;
  currentPage = 1;
  itemsPerPage = 10;
  // modal
  modalRef: BsModalRef;
  // message: string;

  constructor(
    private resourceTypeService: ResourceTypeService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      // console.log(params);
      if (!params['page']) {
        this.router.navigate(['/resourceTypes'], { queryParams: {page : 1}});
        this.getResourceTypes(0, this.itemsPerPage);
      } else {
        this.currentPage = +params['page'];
        const startItem = (this.currentPage - 1) * this.itemsPerPage;
        const endItem = this.currentPage * this.itemsPerPage;
        // console.log(this.viewPage);
        if (this.resourceTypePage) {
          this.viewPage = this.resourceTypePage.results.slice(startItem, endItem);
        } else {
          this.getResourceTypes(startItem, endItem);
        }
      }
    });
  }

  /** GET **/
  getResourceTypes(start, end) {
    // this.resourceTypePage = this.resourceTypePage || {results : [], total : 0, from: 0, to: 0};
    // this.resourceTypePage.results = [];
    this.viewPage = [];
    this.resourceTypeService.getResourceTypes().subscribe(
      resourceTypePage => {
        this.resourceTypePage = resourceTypePage;
      },
      error => this.errorMessage = <any>error,
      () => this.viewPage = this.resourceTypePage.results.slice(start, end)
    );
  }

  /** DELETE **/
  deleteResourceType(name: string) {
    let page: number;
    this.route.queryParams.subscribe(params => {
      // startItem = (+params['page'] - 1) * this.itemsPerPage;
      page = +params['page'];
    });

    this.resourceTypeService.deleteResourceType(name).subscribe(
      res => {
        if ((this.resourceTypePage.total % this.itemsPerPage ) === 1) {
          page--;
          if (page === 0) { page = 1; }
        }
        const startItem = (page - 1) * this.itemsPerPage;
        const endItem = page * this.itemsPerPage;
        this.getResourceTypes(startItem, endItem);
        this.router.navigate(['/resourceTypes'], {queryParams: {page : page}});
      },
      error => this.errorMessage = <any>error,
      () => {}
    );
  }

  deleteAllView() {
    this.checkBoxes.filter(i => i.nativeElement['checked']).forEach(
      x => this.resourceTypeService.deleteResourceType(x.nativeElement['id']).subscribe()
    );
    let page: number;
    page = --this.currentPage;
    console.log('sonic boom');
    if (page === 0) { page = 1; }
    const startItem = (page - 1) * this.itemsPerPage;
    const endItem = page * this.itemsPerPage;
    this.getResourceTypes(startItem, endItem);
    this.router.navigate(['/resourceTypes'], {queryParams: {page : page}});
    console.log(page);
  }

  /** Checkboxes **/
  checkAll(state: boolean) {
    this.checkBoxes.forEach(i => i.nativeElement['checked'] = state);
    this.activateDropDown();
  }

  isAllChecked() {
    let count = 0;
    this.checkBoxes.forEach(i => {
      if (i.nativeElement['checked'] === true) {
        count++;
      }
    });
    console.log('count = ' + count);
    console.log('length = ' + this.checkBoxes.length);
    if (this.checkBoxes.length !== 0 && count === this.checkBoxes.length) {
      this.masterCheckbox.nativeElement['checked'] = true;
    } else {
      this.masterCheckbox.nativeElement['checked'] = false;
    }
    this.activateDropDown();
  }

  /** Pagination **/
  pageChanged(event: PageChangedEvent): void {
    // const startItem = (event.page - 1) * event.itemsPerPage;
    // const endItem = event.page * event.itemsPerPage;
    // // console.log(this.viewPage);
    // this.viewPage = this.resourceTypePage.results.slice(startItem, endItem);
    this.router.navigate(['/resourceTypes'], { queryParams: {page : event.page}});
    // console.log(this.table.nativeElement.scrollHeight);
    this.activateDropDown();
    // window.scrollTo(0, this.table.nativeElement.scrollHeight);  // possibly not needed later on...
    // this.cdr.detectChanges();
    this.isAllChecked();
  }

  /** Modal **/
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(name: string): void {
    // this.message = 'Confirmed!';
    this.modalRef.hide();
    this.deleteResourceType(name);
  }

  confirmBulk(): void {
    this.modalRef.hide();
    this.bulkAction();
  }

  decline(): void {
    this.modalRef.hide();
  }

  /** **/
  bulkAction() {
    if (this.masterCheckbox.nativeElement['checked'] === true) {
      console.log('Boom');
      this.deleteAllView();
    } else {
      this.checkBoxes.filter(i => i.nativeElement['checked'])
        .forEach(x => this.deleteResourceType(x.nativeElement['id']));
    }
    // this.checkBoxes.filter(i => i.nativeElement['checked']).forEach(x => console.log(x.nativeElement['id']));
  }

  activateDropDown() {
    this.isDisabled = this.checkBoxes.filter(i => i.nativeElement['checked']).length === 0;
  }

}
