import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {ResourceComponent} from './resource.component';
import {ResourceListComponent} from './resource-list.component';
import {ResourceDetailComponent} from './resource-detail.component';
import {NewResourceComponent} from './new-resource.component';
import {UpdateResourceComponent} from './update-resource.component';
import {ResourceRouting} from './resource-routing';
import {ResourceService} from '../services/resource.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    ResourceRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  declarations: [
    ResourceComponent,
    ResourceListComponent,
    ResourceDetailComponent,
    NewResourceComponent,
    UpdateResourceComponent,
  ],
  providers: [
    ResourceService
  ]
})

export class ResourceModule {}

