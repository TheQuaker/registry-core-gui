import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {BadRequest400Component} from './bad-request-400.component';


const errorTypeRoutes: Routes = [
  {
    path: 'badRequest',
    component: BadRequest400Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(errorTypeRoutes)],
  exports: [RouterModule]
})

export class ErrorCodesRouting {}
