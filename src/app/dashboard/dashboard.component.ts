import { Component, OnInit } from '@angular/core';
import {SearchService} from '../services/search.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private search: SearchService
  ) {}

  ngOnInit() {
    this.search.nextTitle = 'Dashboard';
    this.search.showField = true; // true means don't show ;)
  }

}
