import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ModalModule} from 'ngx-bootstrap/modal';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {ResourceTypeDetailComponent} from './resource-type-detail.component';
import {ResourceTypeListComponent} from './resource-type-list.component';
import {NewResourceTypeComponent} from './new-resource-type.component';
import {ResourceTypeComponent} from './resource-type.component';
import {ResourceTypeRouting} from './resource-type-routing';
import {ResourceTypeService} from '../services/resource-type.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    ResourceTypeRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  declarations: [
    ResourceTypeComponent,
    ResourceTypeListComponent,
    ResourceTypeDetailComponent,
    NewResourceTypeComponent
  ],
  providers: [
    ResourceTypeService
  ]
})

export class ResourceTypeModule {}
