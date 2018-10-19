import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {BadRequest400Component} from './bad-request-400.component';
import {NotFound404Component} from './not-found-404.component';


const errorTypeRoutes: Routes = [
  {
    path: '400',
    component: BadRequest400Component
  },
  {
    path: '404',
    component: NotFound404Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(errorTypeRoutes)],
  exports: [RouterModule]
})

export class ErrorCodesRouting {}
