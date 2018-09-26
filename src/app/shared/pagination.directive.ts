import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: '[paginate]',
  template: `
    <nav aria-label="Result pages">
      <ul class="pagination">

        <li class="page-item paginate_button" [ngClass]="{disabled : isPreviousPageDisabled}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : 1}">
            First
          </a>
        </li>

        <li class="page-item paginate_button" [ngClass]="{disabled : isPreviousPageDisabled}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : from - size}"
             aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>

        <li *ngFor="let p of pages" class="page-item paginate_button" [ngClass]="{'active' : p == from}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : p}">
            {{p}}
          </a>
        </li>

        <li class="page-item paginate_button" [ngClass]="{disabled : isNextPageDisabled}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : from + size}"
             aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>

        <li class="page-item paginate_button" [ngClass]="{disabled : isNextPageDisabled}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : this.lastPage}">
            Last</a>
        </li>
      </ul>
    </nav>
    <!--<div class="resultsPageLabel">page {{currentPage}} of {{lastPage}}</div>-->
  `,
  styles: [
      `
      .pagination {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        padding-left: 0;
        list-style: none;
        border-radius: 2px;
      }
      /*.page-item:first-child .page-link {*/
        /*margin-left: 0;*/
        /*border-top-left-radius: 2px;*/
        /*border-bottom-left-radius: 2px;*/
      /*}*/
      /*.page-item:last-child .page-link {*/
        /*border-top-right-radius: 2px;*/
        /*border-bottom-right-radius: 2px;*/
      /*}*/
      .page-item.active .page-link {
        z-index: 2;
        color: #000000;
        background-color: #ffffff;
        border-color: #007bff;
      }
      .page-item.disabled .page-link {
        color: rgba(255, 255, 255, 0.85);
        pointer-events: none;
        background-color: rgba(255, 255, 255, 0.08);
        border-color: #ddd;
      }
      .page-link {
         position: relative;
         display: block;
         /*padding: 0 0;*/
         margin-left: -1px;
         line-height: 1.25;
         color: rgba(255, 255, 255, 0.85);
         background-color: rgba(255, 255, 255, 0.08);
         border: 0 solid #ddd;
       }
      .page-link:focus, .page-link:hover {
        color: rgba(255, 255, 255, 0.85);
        text-decoration: none;
        background-color: rgba(255, 255, 255, 0.2);
        border-color: #ddd;
      }
      .pagination-lg .page-link {
        padding: 0.75rem 1.5rem;
        font-size: 1.25rem;
        line-height: 1.5;
      }
      .pagination-lg .page-item:first-child .page-link {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
      }
      .pagination-lg .page-item:last-child .page-link {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }

      .pagination-sm .page-link {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        line-height: 1.5;
      }
      .pagination-sm .page-item:first-child .page-link {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
      }
      .pagination-sm .page-item:last-child .page-link {
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    `
  ]
})

export class PaginationDirectiveComponent implements OnChanges {

  @Input('from')
  from: number = 0;

  @Input('total')
  total: number = 0;

  @Input('size')
  size: number = 1;

  offset: number = 2;

  pages: number[] = [];


  get isNextPageDisabled(): boolean {
    if (this.currentPage === this.lastPage || this.lastPage === 0) {
      return true;
    } else { return false; }
  }

  get isPreviousPageDisabled(): boolean {
    return this.currentPage === 1;
  }

  get currentPage(): number {
    return Math.ceil(this.from / this.size); // + 1;
  }

  get lastPage(): number {
    return Math.ceil(this.total / (this.size * 10));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes.total.currentValue);
    // this.total = changes.total.currentValue;
    this.pages.length = 0;
    // console.log(this.lastPage);
    for (let i = this.from - this.offset; i <= this.from + this.offset; ++i) {
    // for (let i = this.from - this.offset; this.pages.length < (this.offset * 2 + 1) || i <= this.lastPage; ++i) {
    //   console.log('i = ' + i + ' array length ' + this.pages.length);
      if (i > 0 && i <= this.lastPage) {
        this.pages.push(i);
      }
    }
  }
}
