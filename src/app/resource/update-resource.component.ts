import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../services/resource.service';
import {Resource} from '../domain/resource';
import {FormBuilder, FormControl} from '@angular/forms';
import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceType} from '../domain/resource-type';


@Component({
  selector: 'app-update-resource',
  templateUrl: './update-resource.component.html'
})

export class UpdateResourceComponent implements OnInit {

  resourceForm = this.fb.group({
    creationDate: FormControl[''],
    id: FormControl[''],
    modificationDate: FormControl[''],
    payload: FormControl[''],
    payloadFormat: FormControl[''],
    payloadUrl: FormControl[''],
    resourceType: this.fb.group({
      aliasGroup: FormControl[''],
      creationDate: FormControl[''],
      indexFields: this.fb.group({
        defaultValue: FormControl[''],
        label: FormControl[''],
        multivalued: FormControl[''],
        name: FormControl[''],
        path: FormControl[''],
        primaryKey: FormControl[''],
        resourceType: FormControl[''],
        type: FormControl['']
      }),
      indexMapperClass: FormControl[''],
      modificationDate: FormControl[''],
      name: FormControl[''],
      payloadType: FormControl[''],
      schema: FormControl[''],
      schemaUrl: FormControl['']
    }),
    // searchableArea: FormControl[''],
    version: FormControl['']
  });

  public errorMessage: string;
  public resource: Resource;
  public resourceTypes: ResourceType[];

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private resourceTypeService: ResourceTypeService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.getResourceTypes();
    this.getResource();
  }

  getResource(): void {
    const resourceType = this.route.snapshot.paramMap.get('resourceType');
    const id = this.route.snapshot.paramMap.get('id');

    this.resourceService.getResource(resourceType, id).subscribe(
      resource => this.resource = resource,
      error => this.errorMessage = <any>error,
      () => this.resourceForm.patchValue(this.resource)// setValue() should be used
    );
  }

  getResourceTypes() {
    this.resourceTypeService.getResourceTypes().subscribe(
      resourceTypePage => this.resourceTypes = resourceTypePage.results,
      error => this.errorMessage = <any>error
    );
  }

  onTypeSelect(event): void {
    this.resourceForm.patchValue({
      payloadFormat: this.resourceTypes.filter(i => i.name === event.target.value)[0].payloadType,
    });
  }

  goBack() {
    window.history.back();
  }

}
