import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {PaginationModule} from 'ngx-bootstrap/pagination';
import {ModalModule} from 'ngx-bootstrap/modal';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {ResourceTypeComponent} from './resource-type.component';
import {ResourceTypeListComponent} from './resource-type-list.component';
import {NewResourceTypeComponent} from './new-resource-type.component';
import {ResourceTypeDetailComponent} from './resource-type-detail.component';
import {ResourceTypeRouting} from './resource-type-routing';
import {ResourceTypeService} from '../services/resource-type.service';

@NgModule({
  imports: [
    ResourceTypeRouting,
    CommonModule,
    FormsModule,
    PaginationModule.forRoot(),
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
