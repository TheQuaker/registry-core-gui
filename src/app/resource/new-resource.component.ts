import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';

import {ResourceType} from '../domain/resource-type';
import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceService} from '../services/resource.service';
import {Router} from '@angular/router';



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
      payload: ['', Validators.required],
      payloadFormat: ['', Validators.required],
      payloadUrl: ['', Validators.required],
      resourceTypeName: ['', Validators.required],
    });
    this.resourceForm.get('payloadUrl').disable();
  }

  constructor(
    private resourceTypeService: ResourceTypeService,
    private resourceService: ResourceService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) {}

  getResourceTypes() {
    this.resourceTypeService.getResourceTypes().subscribe(
      resourceTypePage => this.resourceTypes = resourceTypePage.results,
      error => this.errorMessage = <any>error
    );
  }

  postResource() {
    this.resourceService.addResource(this.resourceForm.value).subscribe(
      _ => {},
      error => this.errorMessage = <any>error,
      () => this.goBack()
    );
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
    // this.location.back();
    this.router.navigate(['/resources'], {queryParams: {page: 1}, queryParamsHandling: 'merge'});
  }

}
