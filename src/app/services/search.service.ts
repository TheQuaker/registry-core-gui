import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SearchService {

  private searchTerm: string;

  getSearchTerm() {
    return this.searchTerm;
  }

  setSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
  }
}
