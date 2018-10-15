import {ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {ResourceTypeService} from '../services/resource-type.service';
import {SearchService} from '../services/search.service';
import {ResourceTypePage} from '../domain/resource-type-page';
import {ResourceType} from '../domain/resource-type';
import {filter} from 'rxjs/operators';


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
  public searchResults: ResourceType[];
  currentPage = 1;
  itemsPerPage = 10;
  // modal
  modalRef: BsModalRef;

  constructor(
    private resourceTypeService: ResourceTypeService,
    private search: SearchService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.search.nextTitle = 'Resource Types';
    this.search.showField = false;
    this.search.initSearchTerm();
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
          this.isAllChecked();
        } else {
          this.getResourceTypes(startItem, endItem);
        }
      }
    });

    this.search.searchTerm.subscribe(
      s => {
        if (s !== null) {
          s = s.trim();
        }
        // this.onSearch(s); search method
        console.log('Resource Search');
      }
    );
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

  deleteBatch() {
    const nameArray: string[] = [];
    this.checkBoxes.filter(i => i.nativeElement['checked']).forEach(
      x => nameArray.push(x.nativeElement['id'])
    );
    let page = this.currentPage;
    // let reload = true;
    if (this.masterCheckbox.nativeElement['checked']) {
      page--;
      // reload = false;
      if (page === 0) {
        page = 1;
        // reload = true;
      }
    }
    for (let i = 0; i < nameArray.length; i++) {
      this.resourceTypeService.deleteResourceType(nameArray[i]).subscribe(
        _ => {
          if (i === nameArray.length - 1) {
            const startItem = (page - 1) * this.itemsPerPage;
            const endItem = page * this.itemsPerPage;
            this.getResourceTypes(startItem, endItem);
            this.router.navigate(['/resourceTypes'], {queryParams: {page: page}});
            // if (reload === true) { window.location.reload(); }
          }
        }
      );
    }
  }

  /** Search **/
  onSearch(s: string) {
    let resourceType;
    for (resourceType in this.resourceTypePage.results) {

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
    // console.log('count = ' + count);
    // console.log('length = ' + this.checkBoxes.length);
    if (this.checkBoxes.length !== 0 && count === this.checkBoxes.length) {
      this.masterCheckbox.nativeElement['checked'] = true;
    } else {
      this.masterCheckbox.nativeElement['checked'] = false;
    }
    this.activateDropDown();
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
    this.deleteBatch();
  }

  activateDropDown() {
    this.isDisabled = this.checkBoxes.filter(i => i.nativeElement['checked']).length === 0;
  }

}
