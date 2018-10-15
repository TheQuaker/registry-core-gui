import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {ResourceService} from '../services/resource.service';
import {SearchService} from '../services/search.service';
import {IndexedFields} from '../domain/indexed-fields';
import {Resource} from '../domain/resource';


@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.component.html'
})

export class ResourceDetailComponent implements OnInit {

  public errorMessage: string;
  public resource: Resource;
  public indexedFields: IndexedFields[];

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private search: SearchService,
    private location: Location
  ) {}

  ngOnInit() {
    this.search.nextTitle = 'Resource Details';
    this.search.showField = true; // true means don't show ;)
    this.getResource();
    this.getIndexedFields();
  }

  getResource(): void {
    const resourceType = this.route.snapshot.paramMap.get('resourceType');
    const id = this.route.snapshot.paramMap.get('id');

    this.resourceService.getResource(resourceType, id).subscribe(
      resource => this.resource = resource,
      error => this.errorMessage = <any>error
    );
  }

  getIndexedFields(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.resourceService.getIndexedFields(id).subscribe(
      indexedField => this.indexedFields = indexedField,
      error => this.errorMessage = <any>error,
      // () => console.log(this.indexedFields)
    );
  }

  goBack() {
    // window.history.back();
    this.location.back();
  }

}
