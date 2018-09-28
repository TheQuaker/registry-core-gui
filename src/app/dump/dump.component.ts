import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {Router} from '@angular/router';

// import { saveAs as importedSaveAs} from 'file-saver';

import {ResourceType} from '../domain/resource-type';
import {ResourceTypeService} from '../services/resource-type.service';
import {DumpService} from '../services/dump.service';


@Component({
  selector: 'app-dump',
  templateUrl: './dump.component.html'
})

export class DumpComponent implements OnInit {

  dumpForm: FormGroup;
  public resourceTypeSelector: ResourceType[];
  public resourceTypeNameArray: string[];
  public errorMessage: string;
  file;

  constructor(
    private resourceTypeService: ResourceTypeService,
    private dumpService: DumpService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getResourceTypes();
    this.dumpForm = this.fb.group({
      raw: ['false'],
      schema: ['false'],
      version: ['false'],
      resourceTypes: this.fb.array([
      ])
    });
  }

  getResourceTypes() { // backend call
    this.resourceTypeService.getResourceTypes().subscribe(
      resourceTypePage => this.resourceTypeSelector = resourceTypePage.results,
      error => this.errorMessage = <any>error,
      () => {
        this.resourceTypeNameArray = [];
        for (let i = 0 ; i < this.resourceTypeSelector.length ; i++) {
          this.resourceTypeNameArray.push(this.resourceTypeSelector[i].name);
        }
        this.resourceTypeNameArray.sort((a, b) => 0 - (a > b ? -1 : 1));
      }
    );
  }

  get resourceTypes() { // return form resource types as array
    return this.dumpForm.get('resourceTypes') as FormArray;
  }

  addField() {
    this.resourceTypes.push(this.fb.control(''));
  }

  removeField(i) {
    let j = 0;
    while (j < this.resourceTypes.length) {
      if (this.resourceTypes.value[j] === i.value) {
        break;
      }
      j++;
    }
    // console.log(i.value);
    // console.log(j);
    this.resourceTypes.removeAt(j);
    this.resourceTypeNameArray.push(i.value);
    this.resourceTypeNameArray.sort((a, b) => 0 - (a > b ? -1 : 1));
  }

  onTypeSelect(event): void {
    this.resourceTypes.push(this.fb.control({value: event.target.value, disabled: true}));
    // this.resourceTypes.push(this.fb.control(event.target.value));

    const i = this.resourceTypeNameArray.indexOf(event.target.value, 0);
    // console.log(this.resourceTypeNameArray);
    // console.log(i);
    if (i > -1) {
      this.resourceTypeNameArray.splice(i, 1);
    }
    event.target.value = 'null';
  }

  submit() {
    this.dumpService.getDumpFile(
      this.dumpForm.get('raw').value,
      this.dumpForm.get('schema').value,
      this.dumpForm.get('version').value,
      this.dumpForm.get('resourceTypes').value)
      .subscribe(
        res => this.file = res,
        error => this.errorMessage = <any>error,
        () => console.log(this.file)
      );
  }
  // submit() {
  //   this.dumpService.getDumpFile(
  //     this.dumpForm.get('raw').value,
  //     this.dumpForm.get('schema').value,
  //     this.dumpForm.get('version').value,
  //     this.dumpForm.get('resourceTypes').value);
  //     .subscribe(
  //       blob => {importedSaveAs(blob, this.file);
  //       }
  //     );
  // }

  goBack() {
    this.router.navigate(['']);

  }

}
