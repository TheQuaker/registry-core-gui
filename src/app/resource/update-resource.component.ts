import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../services/resource.service';
import {Resource} from '../domain/resource';
import {FormBuilder, Validators} from '@angular/forms';
import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceType} from '../domain/resource-type';


@Component({
  selector: 'app-update-resource',
  templateUrl: './update-resource.component.html'
})

export class UpdateResourceComponent implements OnInit {

  resourceForm = this.fb.group({
    payload: ['', Validators.required],
    payloadFormat: ['', Validators.required],
    payloadUrl: ['', Validators.required],
    resourceTypeName: ['', Validators.required],
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
      () => {
        this.resourceForm.patchValue(this.resource);
        if (this.resourceForm.get('payload').value) {
          this.resourceForm.get('payloadUrl').disable();
        } else { this.resourceForm.get('payload').disable(); }
      }
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

  putResource() {
    this.resourceService.updateResource(this.resourceForm.value).subscribe(
      _ => {},
      error => this.errorMessage = <any>error,
      () => this.goBack()
    );
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
