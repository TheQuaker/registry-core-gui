import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: '[paginate]',
  template: `
    <nav aria-label="Result pages">
      <ul class="pagination">

        <li class="page-item" [ngClass]="{disabled : isPreviousPageDisabled}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : 1}">
            First
          </a>
        </li>

        <li class="page-item" [ngClass]="{disabled : isPreviousPageDisabled}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : from - size}"
             aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>

        <li *ngFor="let p of pages" class="page-item" [ngClass]="{'active' : p == from}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : p}">
            {{p}}
          </a>
        </li>

        <li class="page-item" [ngClass]="{disabled : isNextPageDisabled}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : from + size}"
             aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>

        <li class="page-item" [ngClass]="{disabled : isNextPageDisabled}">
          <a class="page-link" queryParamsHandling="merge" [routerLink]="['.']" [queryParams]="{page : this.lastPage}">
            Last</a>
        </li>
      </ul>
    </nav>
    <!--<div class="resultsPageLabel">page {{currentPage}} of {{lastPage}}</div>-->
  `,
  styles: [
      `
      .resultsPageLabel {
        margin-top: -40px;
        text-align: center;
        font-family: Montserrat;
        font-size: 12px;
        font-weight: 300;
        color: #9f9b9b;
        text-transform: uppercase;
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
