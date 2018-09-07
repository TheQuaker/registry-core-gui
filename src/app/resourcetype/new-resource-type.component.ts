import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-resource-type-form',
  templateUrl: './new-resource-type.component.html'
})

export class NewResourceTypeComponent implements OnInit {


  resourceTypeForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.resourceTypeForm = this.fb.group({
      name: ['', Validators.required],
      schema: ['', Validators.required],
      schemaUrl: ['', Validators.required],
      payloadType: ['', Validators.required],
      creationDate: [''],
      modificationDate: [''],
      indexMapperClass: ['', Validators.required],
      indexFields: this.fb.array([
        this.fb.control('')
      ]),
    });
    this.resourceTypeForm.get('indexMapperClass').disable();
    this.resourceTypeForm.get('payloadType').setValue('xml');
  }

  goBack() {
    window.history.back();
  }

  updateIndexMapperClass(select: string) {
    if (select === 'default') {
      this.resourceTypeForm.get('indexMapperClass').disable();
      this.resourceTypeForm.get('indexMapperClass').setValue('');
    } else {
      this.resourceTypeForm.get('indexMapperClass').enable();
    }

  }

}
