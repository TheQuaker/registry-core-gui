import {
  ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl} from '@angular/forms';

import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceService} from '../services/resource.service';
import {SearchService} from '../services/search.service';
import {ResourceTypePage} from '../domain/resource-type-page';
import {ResourcePage} from '../domain/resource-page';


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
    private search: SearchService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.search.initSearchTerm();
    this.getResourceTypes();
    this.route.queryParams.subscribe(
      params => {
        // console.log(params);
        this.search.nextTitle = 'Resources';
        this.search.showField = false;
        let query: string;
        let resourceType: string;
        if (params['resourceType'] && params['resourceType'] !== 'all') {
          resourceType = params['resourceType'];
          if (resourceType !== '*') {
            this.search.nextTitle = resourceType;
          }
          if (resourceType !== '*') {
            this.filterForm.get('resourceType').setValue(resourceType);
          }
        } else {
          resourceType = '*';
          if (params['resourceType'] === 'all') {
            this.search.nextTitle = 'All types';
            this.filterForm.get('resourceType').setValue('all');
          } else {
            this.filterForm.get('resourceType').setValue('null');
          }
        }
        if (params['searchTerm']) {
          query = params['searchTerm'];
          if (query !== '*') {
            this.filterForm.get('queryString').setValue(query);
            this.search.nextTitle = 'Search results';
          }
        } else {
          query = '*';
          this.filterForm.get('queryString').setValue('');
        }
        if (!params['page']) {
          this.router.navigate(['/resources'], {queryParams: {page: 1}, queryParamsHandling: 'merge'});
          // this.getResources(resourceType, query, '0');
        } else {
          this.currentPage = +params['page'];
          if (this.currentPage <= 0 ) {
            this.router.navigate(['/404'], { skipLocationChange: true });
          } else {
            const startItem = (+params['page'] - 1) * this.itemsPerPage;
            this.getResources(resourceType, query, `${startItem}`);
          }
        }
      },
      error => this.errorMessage = <any>error,
    );

    this.search.searchTerm.subscribe(
      s => {
        if (s !== null) {
          s = s.trim();
        }
        this.onSearch(s);
      }
    );
  }

  /** GET **/
  getResources(resourceType: string, query: string, from: string): void {
    this.resourcePage = this.resourcePage || {results: [], total: 0, from: 0, to: 0};
    this.resourcePage.results = [];
    this.resourceService.getResourcesBySearch(resourceType, query, from).subscribe(
      // this.resourceService.getResources(from, to).subscribe(
      resourcePage => {
        this.resourcePage = resourcePage;
      },
      error => this.errorMessage = <any>error,
      () => {
        if (this.currentPage > Math.ceil(this.resourcePage.total / this.itemsPerPage) && this.currentPage !== 1) {
          this.router.navigate(['/404'], { skipLocationChange: true });
        }
        this.isAllChecked();
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
    this.search.nextTitle = event.target.value;
    if (this.filterForm.get('queryString').value === '') {
      searchTerm = '*';
    } else {
      searchTerm = this.filterForm.get('queryString').value;
    }
    this.router.navigate(['/resources'],
      {queryParams: {resourceType: event.target.value, searchTerm: searchTerm, page: 1}, queryParamsHandling: ''});
  }

  onSearch(searchTerm) {
    // console.log(this.filterForm.value);
    let query: string;
    let resourceType: string;
    if (this.filterForm.controls['resourceType'].value && this.filterForm.controls['resourceType'].value !== 'null') {
      resourceType = this.filterForm.controls['resourceType'].value;
    } else {
      resourceType = '*';
    }
    if (searchTerm === '') {
      query = '*';
    } else {
      query = searchTerm;
    }
    // console.log('Query = ' + query);
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
          this.router.navigate(['/resources'], {queryParams: {page: page}, queryParamsHandling: 'merge'});
        } else {
          window.location.reload();
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  deleteBatch(): void {
    const idArray: string[] = [];
    this.checkBoxes.filter(i => i.nativeElement['checked'])
      .forEach(x => idArray.push(x.nativeElement['id']));
    // console.log(idArray);
    let page = this.currentPage;
    let reload = true;

    if (this.masterCheckbox.nativeElement['checked']) {
      page--;
      reload = false;
      if (page === 0) {
        page = 1;
        reload = true;
      }
    }
    for (let i = 0; i < idArray.length; i++) {
      this.resourceService.deleteResource(idArray[i]).subscribe(
        _ => {
          if (i === idArray.length - 1) {
            this.router.navigate(['/resources'], {queryParams: {page: page}, queryParamsHandling: 'merge'});
            if (reload === true) {
              window.location.reload();
            }
          }
        }
      );
    }
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
    this.deleteBatch();
  }

  activateDropDown() {
    this.isDisabled = this.checkBoxes.filter(i => i.nativeElement['checked']).length === 0;
  }
}
