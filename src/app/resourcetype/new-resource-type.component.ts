import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';


@Component({
  selector: 'app-resource-type-form',
  templateUrl: './new-resource-type.component.html'
})

export class NewResourceTypeComponent implements OnInit {

  resourceTypeForm = this.fb.group({
    name: FormControl[''],
    schema: FormControl[''],
    schemaUrl: FormControl[''],
    payloadType: FormControl[''],
    creationDate: FormControl[''],
    modificationDate: FormControl[''],
    indexMapperClass: FormControl[''],
    indexFields: this.fb.array([
      this.fb.control('')
    ]),
  });

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {}

  goBack() {
    window.history.back();
  }

}
