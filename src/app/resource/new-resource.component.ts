import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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

  public resourceTypes: ResourceType[];
  public errorMessage: string;

  resourceForm: FormGroup;

  ngOnInit() {
    this.getResourceTypes();
    this.resourceForm = this.fb.group({
      // creationDate: [''],
      // id: [''],
      // modificationDate: [''],
      payload: ['', Validators.required],
      payloadFormat: [''],
      payloadUrl: ['', Validators.required],
      resourceTypeName: ['', Validators.required],
      // searchableArea: FormControl[''],
      // version: ['']
    });
    this.resourceForm.get('payloadUrl').disable();
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
    // console.log(this.resourceTypes.filter(i => i.name === event.target.value)[0]);
    this.resourceForm.patchValue({
      payloadFormat: this.resourceTypes.filter(i => i.name === event.target.value)[0].payloadType,
    });
  }

  radioBtnUrl(select: string): void {
    if (select === 'url') {
      this.resourceForm.get('payload').disable();
      this.resourceForm.get('payloadUrl').enable();
      this.resourceForm.get('payload').setValue('');
    } else {
      this.resourceForm.get('payloadUrl').disable();
      this.resourceForm.get('payload').enable();
      this.resourceForm.get('payloadUrl').setValue('');
    }
  }

  goBack() {
    window.history.back();
  }

}
