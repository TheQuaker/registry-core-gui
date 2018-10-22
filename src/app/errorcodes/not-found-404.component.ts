import {Component, OnInit} from '@angular/core';
import {SearchService} from '../services/search.service';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found-404.component.html'
})

export class NotFound404Component implements OnInit {

  constructor(
    private search: SearchService
  ) {}

  ngOnInit() {
    this.search.nextTitle = '404';
    this.search.showField = true;
  }

}
