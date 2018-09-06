import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
// import { Validators } from '@angular/forms';
// import { FormArray } from '@angular/forms';

import {ResourceType} from '../domain/resource-type';
import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceService} from '../services/resource.service';



@Component({
  selector: 'app-new-resource',
  templateUrl: './new-resource.component.html'
})

export class NewResourceComponent implements OnInit {

  resourceForm = this.fb.group({
    creationDate: FormControl[''],
    id: FormControl[''],
    modificationDate: FormControl[''],
    payload: FormControl[''],
    payloadFormat: FormControl[''],
    payloadUrl: FormControl[''],
    resourceTypeName: FormControl,
    // searchableArea: FormControl[''],
    version: FormControl['']
  });

  public resourceTypes: ResourceType[];
  public errorMessage: string;

  ngOnInit() {
    this.getResourceTypes();
  }

  constructor(
    private resourceTypeService: ResourceTypeService,
    private resourceService: ResourceService,
    private fb: FormBuilder
  ) {}

  getResourceTypes() {
    this.resourceTypeService.getResourceTypes().subscribe(
      resourceTypePage => this.resourceTypes = resourceTypePage.results,
      error => this.errorMessage = <any>error
    );
  }

  postResource() {
    this.resourceService.addResource(this.resourceForm.value).subscribe();
  }

  onTypeSelect(event): void {
    // console.log(event.target.value);
    console.log(this.resourceTypes.filter(i => i.name === event.target.value)[0]);
    this.resourceForm.patchValue({
      payloadFormat: this.resourceTypes.filter(i => i.name === event.target.value)[0].payloadType,
      // resourceType: {
      //   name: event.target.value
      // }
    });
  }

  goBack() {
    window.history.back();
  }

}
