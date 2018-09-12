import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PaginationDirectiveComponent} from './pagination.directive';
import {RouterModule} from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    PaginationDirectiveComponent
  ],
  exports: [
    PaginationDirectiveComponent
  ]
})

export class SharedModule {}

