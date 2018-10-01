import {
  ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl} from '@angular/forms';

import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {ResourcePage} from '../domain/resource-page';
import {ResourceService} from '../services/resource.service';
import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceTypePage} from '../domain/resource-type-page';


@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['resource-list.component.css']
})

export class ResourceListComponent implements OnInit {

  filterForm = this.fb.group({
    resourceType: FormControl[''],
    queryString: FormControl['']
  });

  @ViewChild('table')
  public table: ElementRef;

  @ViewChild('masterCheckbox')
  public masterCheckbox: ElementRef;

  @ViewChildren('checkBoxes')
  public checkBoxes: QueryList<ElementRef>;

  public isDisabled = true;
  public errorMessage: string;
  public resourcePage: ResourcePage;
  public resourceTypePage: ResourceTypePage;

  // pagination
  itemsPerPage = 10;
  currentPage = 1;

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
          if (params['resourceType'] === 'all') {
            this.filterForm.get('resourceType').setValue('all');
          } else {
            this.filterForm.get('resourceType').setValue('null');
          }
        }
        if (params['searchTerm']) {
          query = params['searchTerm'];
          if (query !== '*') {
            this.filterForm.get('queryString').setValue(query);
          }
        } else {
          query = '*';
          this.filterForm.get('queryString').setValue('');
        }
        if (!params['page'] ) {
          this.router.navigate(['/resources'], {queryParams: {page: 1}, queryParamsHandling: 'merge'});
          // this.getResources(resourceType, query, '0');
        } else {
          // setTimeout(() => {this.currentPage = +params['page']; }, 300);
          this.currentPage = +params['page'];
          // console.log(this.currentPage);
          const startItem = (+params['page'] - 1) * this.itemsPerPage;
          // setTimeout(() => { this.getResources(resourceType, query, `${startItem}`); }, 500);
          this.getResources(resourceType, query, `${startItem}`);
          // this.getResources(resourceType, query, `${startItem}`);
          // console.log('Ng onInit2 ' + this.resourcePage.total);
        }
      },
      error => this.errorMessage = <any>error,
      () => { // Never reaches this statement
        // console.log('Ng onInit1 ' + this.resourcePage.total);
      }
    );
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
      () => {
        this.isAllChecked();
        // console.log('GetResources ' + this.resourcePage.total);
      }
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
    this.router.navigate(['/resources'],
      {queryParams: {resourceType: event.target.value, searchTerm: searchTerm, page: 1}, queryParamsHandling: ''});
  }

  onSearch() {
    // console.log(this.filterForm.value);
    let query: string;
    let resourceType: string;
    if (this.filterForm.controls['resourceType'].value && this.filterForm.controls['resourceType'].value !== 'null' ) {
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
  }

  /** DELETE **/
  deleteResource(id: string): void {
    let query: string;
    let resourceType: string;
    // let startItem: number;
    let page: number;
    this.route.queryParams.subscribe(
      params => {
        // console.log(params);
        if (params['resourceType'] && params['resourceType'] !== 'all') {
          resourceType = params['resourceType'];
          // console.log('this resourceType = ' + resourceType);
        } else {
          resourceType = '*';
        }
        if (this.filterForm.controls['queryString'].value) {
          query = this.filterForm.controls['queryString'].value;
        } else {
          query = '*';
        }
         // startItem = (+params['page'] - 1) * this.itemsPerPage;
        page = +params['page'];
      });

    // console.log('resourceType = ' + resourceType + '\nquery = ' + query + '\nstart item = ' + startItem + '\npage = ' + page);
    this.resourceService.deleteResource(id).subscribe(
      res => {
        // this.router.navigate(['/resources'], { queryParams: {page : page}, queryParamsHandling: 'merge'});
        if ((this.resourcePage.total % this.itemsPerPage) === 1) {
          page = page - 1;
          if (page === 0) {
            page = 1;
            window.location.reload();
          }
          this.router.navigate(['/resources'], { queryParams: {page : page}, queryParamsHandling: 'merge'});
        } else { window.location.reload(); }
      },
      error => this.errorMessage = <any>error,
      () => {
      }
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
