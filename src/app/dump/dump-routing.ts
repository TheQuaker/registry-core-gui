import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DumpComponent} from './dump.component';

const dumpRoutes: Routes = [
  {
    path: 'dump',
    component: DumpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(dumpRoutes)],
  exports: [RouterModule]
})

export class DumpRouting {}
