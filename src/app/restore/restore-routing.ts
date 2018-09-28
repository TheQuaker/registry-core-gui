import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RestoreComponent} from './restore.component';

const restoreRoutes: Routes = [
  {
    path: 'dump',
    component: RestoreComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(restoreRoutes)],
  exports: [RouterModule]
})

export class RestoreRouting {}
