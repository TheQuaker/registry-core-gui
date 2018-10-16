import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchService {

  private searchTerm_: Subject<string> = new Subject();

  private pageTitle_: Subject<string> = new Subject();

  private searchField_: Subject<boolean> = new Subject();

  private clearSearchField_: Subject<boolean> = new Subject();

  constructor() {}

  get searchTerm(): Subject<string> {
    return this.searchTerm_;
  }

  initSearchTerm() {
    this.searchTerm_ = new Subject<string>(); // forget old terms
    this.clearSearchField_.next(true);  // empty search field
  }

  get pageTitle(): Subject<string> {
    return this.pageTitle_;
  }

  set nextTitle(s: string) {
    this.pageTitle_.next(s);
  }

  get searchField(): Subject<boolean> {
    return this.searchField_;
  }

  set showField(bool: boolean) {
    this.searchField_.next(bool);
  }

  get clearSearchField() {
    return this.clearSearchField_;
  }

  // clearField() {
  //   this.clearSearchField_.next(true);
  // }
}
