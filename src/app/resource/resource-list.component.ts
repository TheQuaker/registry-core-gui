import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';

// import {PageChangedEvent} from 'ngx-bootstrap/pagination';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {ResourcePage} from '../domain/resource-page';
import {ResourceService} from '../services/resource.service';
import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceTypePage} from '../domain/resource-type-page';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl} from '@angular/forms';


@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html'
})

export class ResourceListComponent implements OnInit {

  filterForm = this.fb.group({
    resourceType: FormControl[''],
    queryString: FormControl['']
  });

  @ViewChild('masterCheckbox')
  public masterCheckbox: ElementRef;

  @ViewChild('table')
  public table: ElementRef;

  @ViewChildren('checkBoxes')
  public checkBoxes: QueryList<ElementRef>;

  public isDisabled = true;
  public errorMessage: string;
  public resourcePage: ResourcePage;
  public resourceTypePage: ResourceTypePage;

  // pagination
  itemsPerPage = 10;
  currentPage = 1;
  rotate = true;
  showBoundaryLinks = true;
  maxSize = 5;

  // modal
  modalRef: BsModalRef;

  constructor(
    private resourceService: ResourceService,
    private resourceTypeService: ResourceTypeService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getResourceTypes();
    this.route.queryParams.subscribe(
      params => {
        // console.log(params);
        let query: string;
        let resourceType: string;

        if (params['resourceType'] && params['resourceType'] !== 'all') {
          resourceType = params['resourceType'];
          if (resourceType !== '*') {
            this.filterForm.get('resourceType').setValue(resourceType);
          }
        } else {
          resourceType = '*';
        }
        if (params['searchTerm']) {
          query = params['searchTerm'];
          if (query !== '*') {
            this.filterForm.get('queryString').setValue(query);
          }
        } else {
          query = '*';
        }
        if (!params['page']) {
          this.router.navigate(['/resources'], {queryParams: {page: 1}, queryParamsHandling: 'merge'});
          // this.getResources(resourceType, query, '0');
        } else {
          // setTimeout(() => {this.currentPage = +params['page']; }, 300);
          this.currentPage = +params['page'];
          // console.log(this.currentPage);
          const startItem = (+params['page'] - 1) * this.itemsPerPage;
          this.getResources(resourceType, query, `${startItem}`);
        }
      },
      // error => this.errorMessage = <any>error,
      // () => {
      //   setTimeout(() => {this.currentPage = +this.route.snapshot.paramMap.get('page'); }, 500);
      //   console.log(this.currentPage);
      // }
    );
    // setTimeout(() => {this.currentPage = +this.route.queryParams.value.page; }, 200);
    // console.log(this.route.queryParams.value.page);
  }

  /** GET **/
  getResources(resourceType: string, query: string, from: string): void {
    this.resourcePage = this.resourcePage || {results : [], total : 0, from: 0, to: 0};
    this.resourcePage.results = [];
    this.resourceService.getResourcesBySearch(resourceType, query, from).subscribe(
      // this.resourceService.getResources(from, to).subscribe(
      resourcePage => {
        this.resourcePage = resourcePage;
      },
      error => this.errorMessage = <any>error,
      // () => console.log(this.resourcePage)
    );
  }

  getResourceTypes(): void {
    this.resourceTypeService.getResourceTypes().subscribe(
      resourceTypePage => this.resourceTypePage = resourceTypePage,
      error => this.errorMessage = <any>error
    );
  }

  onTypeSelect(event) {
    // console.log(event.target.value);
    let searchTerm: string;
    if (this.filterForm.get('queryString').value === '') {
      searchTerm = '*';
    } else {
      searchTerm = this.filterForm.get('queryString').value;
    }
    if (event.target.value === 'all') {
      this.resourceService.getResourcesBySearch('*', searchTerm, '0').subscribe(
        resourcePage => this.resourcePage = resourcePage,
        error => this.errorMessage = <any>error,
        // () => this.viewPage = this.resourcePage.results.slice(0, 10)
      );
    } else {
      this.resourceService.getResourcesBySearch(event.target.value, searchTerm, '0').subscribe(
        resourcePage => this.resourcePage = resourcePage,
        error => this.errorMessage = <any>error,
        // () => this.viewPage = this.resourcePage.results.slice(0, 10)
      );
    }
    this.router.navigate(['/resources'],
      {queryParams: {resourceType: event.target.value, searchTerm: searchTerm}, queryParamsHandling: ''});
  }

  onSearch() {
    console.log(this.filterForm.value);
    let query: string;
    let resourceType: string;
    if (this.filterForm.controls['resourceType'].value) {
      resourceType = this.filterForm.controls['resourceType'].value;
    } else {
      resourceType = '*';
    }
    if (this.filterForm.controls['queryString'].value) {
      query = this.filterForm.controls['queryString'].value;
    } else {
      query = '*';
    }
    this.router.navigate(['/resources'], {queryParams: {resourceType: resourceType, searchTerm: query}, queryParamsHandling: ''});
    if (resourceType === 'all') {
      resourceType = '*';
    }
    this.getResources(resourceType, query, '0');
  }

  /** DELETE **/
  deleteResource(id: string): void {
    const params = this.route.queryParams;
    console.log(params);
    let query: string;
    let resourceType: string;
    let startItem: number;
    if (params['resourceType'] && params['resourceType'] !== 'all') {
      resourceType = params['resourceType'];
    } else {
      resourceType = '*';
    }
    if (this.filterForm.controls['queryString'].value) {
      query = this.filterForm.controls['queryString'].value;
    } else {
      query = '*';
    }
    startItem = (+params['page'] - 1) * this.itemsPerPage;

    this.resourceService.deleteResource(id).subscribe(
      res => console.log(res),
      error => this.errorMessage = <any>error,
      () => this.getResources(resourceType, query, `${startItem}`)
    );
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
    // console.log('count = ' + count);
    // console.log('length = ' + this.checkBoxes.length);
    this.masterCheckbox.nativeElement['checked'] = (this.checkBoxes.length !== 0 && count === this.checkBoxes.length);
    this.activateDropDown();
  }

  /** Modal **/
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(id: string): void {
    this.modalRef.hide();
    this.deleteResource(id);
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
    this.checkBoxes.filter(i => i.nativeElement['checked']).forEach(x => this.deleteResource(x.nativeElement['id']));
    // this.checkBoxes.filter(i => i.nativeElement['checked']).forEach(x => console.log(x.nativeElement['id']));
  }

  activateDropDown() {
    this.isDisabled = this.checkBoxes.filter(i => i.nativeElement['checked']).length === 0;
  }

}
