import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SearchService {

  private searchTerm_: Subject<string> = new Subject();

  private pageTitle_: Subject<string> = new Subject();

  constructor() {
    this.searchTerm_.subscribe((query: string) => {
      console.log(query);
    });
  }

  get searchTerm(): Subject<string> {
    return this.searchTerm_;
  }

  get pageTitle(): Subject<string> {
    return this.pageTitle_;
  }

  set nextTitle(s: string) {
    this.pageTitle_.next(s);
  }

  // set searchTerm(searchTerm: Subject<string>) {
  //   this.searchTerm_ = searchTerm;
  // }
}
