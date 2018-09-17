import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceType} from '../domain/resource-type';
import {Location} from '@angular/common';


@Component({
  selector: 'app-resource-type-detail',
  templateUrl: './resource-type-detail.component.html'
})

export class ResourceTypeDetailComponent implements OnInit {

  public errorMessage: string;
  public resourceType: ResourceType;

  constructor(
    private route: ActivatedRoute,
    private resourceTypeService: ResourceTypeService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getResourceType();
  }

  getResourceType(): void {
    const name = this.route.snapshot.paramMap.get('name');

    this.resourceTypeService.getResourceType(name).subscribe(
      resourceType => this.resourceType = resourceType,
      error => this.errorMessage = <any>error
    );
  }

  goBack() {
    this.location.back();
  }

}
