import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BadRequest400Component} from './bad-request-400.component';
import {ResourceTypeService} from '../services/resource-type.service';
import {ResourceService} from '../services/resource.service';
import {ErrorCodesRouting} from './error-codes-routing';
import {NotFound404Component} from './not-found-404.component';


@NgModule({
  imports: [
    CommonModule,
    ErrorCodesRouting
  ],
  declarations: [
    BadRequest400Component,
    NotFound404Component
  ],
  providers: [
    ResourceService,
    ResourceTypeService
  ]
})

export class ErrorCodesModule {}
