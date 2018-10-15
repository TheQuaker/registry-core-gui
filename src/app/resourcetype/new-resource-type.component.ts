import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {ResourceTypeService} from '../services/resource-type.service';
import {SearchService} from '../services/search.service';


@Component({
  selector: 'app-resource-type-form',
  templateUrl: './new-resource-type.component.html'
})

export class NewResourceTypeComponent implements OnInit {

  resourceTypeForm: FormGroup;
  public errorMessage: string;

  constructor(
    private resourceTypeService: ResourceTypeService,
    private search: SearchService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.search.nextTitle = 'Add new Resource Type';
    this.search.showField = true; // true means don't show ;)
    this.resourceTypeForm = this.fb.group({
      name: ['', Validators.required],
      schema: ['', Validators.required],
      schemaUrl: ['', Validators.required],
      payloadType: ['', Validators.required],
      // creationDate: [''],
      // modificationDate: [''],
      indexMapperClass: ['', Validators.required],
      indexFields: this.fb.array([
        this.fb.group({
          name: [''],
          path: [''],
          type: [''],
          // defaultValue: [''],
          multivalued: ['false'],
          // primaryKey:  [''],
        })
      ]),
    });
    this.resourceTypeForm.get('schemaUrl').disable();
    this.resourceTypeForm.get('indexMapperClass').disable();
    this.resourceTypeForm.get('payloadType').setValue('xml');
  }

  postResourceType(): void {
    this.resourceTypeForm.get('indexMapperClass').enable();
    if (this.resourceTypeForm.get('indexMapperClass').value === '') {
      this.resourceTypeForm.get('indexMapperClass').setValue(
        'eu.openminted.registry.core.index.DefaultIndexMapper');
    }
    const temp = <FormArray>this.resourceTypeForm.get('indexFields').value;
    if (temp[0].name === '') {
      this.resourceTypeForm.get('indexFields').disable();
    }
    // console.log(this.resourceTypeForm.value);
    this.resourceTypeService.addResourceType(this.resourceTypeForm.value).subscribe(
      _ => {},
      error => this.errorMessage = <any>error,
      () => this.goBack()
    );
  }

  updateIndexMapperClass(select: string) {
    if (select === 'default') {
      this.resourceTypeForm.get('indexMapperClass').disable();
      this.resourceTypeForm.get('indexMapperClass').setValue('');
    } else {
      this.resourceTypeForm.get('indexMapperClass').enable();
    }
  }

  radioBtnUrl(select: string): void {
    if (select === 'url') {
      this.resourceTypeForm.get('schema').disable();
      this.resourceTypeForm.get('schemaUrl').enable();
      this.resourceTypeForm.get('schema').setValue('');
    } else {
      this.resourceTypeForm.get('schemaUrl').disable();
      this.resourceTypeForm.get('schema').enable();
      this.resourceTypeForm.get('schemaUrl').setValue('');
    }
  }

  addIndexField(): void {
    const temp = <FormArray>this.resourceTypeForm.get('indexFields');
      temp.push(
      this.fb.group({
      name: [''],
      path: [''],
      type: [''],
      // defaultValue: [''],
      multivalued: ['false'],
      // primaryKey:  [''],
    }));
  }

  goBack() {
    // this.location.back();
    this.router.navigate(['/resourceTypes'], {queryParams: {page: 1}, queryParamsHandling: 'merge'});
  }

}
