import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

import {ResourceService} from '../services/resource.service';
import {Resource} from '../domain/resource';


@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.component.html'
})

export class ResourceDetailComponent implements OnInit {

  public errorMessage: string;
  public resource: Resource;

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getResource();
  }

  getResource(): void {
    const resourceType = this.route.snapshot.paramMap.get('resourceType');
    const id = this.route.snapshot.paramMap.get('id');

    this.resourceService.getResource(resourceType, id).subscribe(
      resource => this.resource = resource,
      error => this.errorMessage = <any>error
    );
  }

  goBack() {
    // window.history.back();
    this.location.back();
  }

}
