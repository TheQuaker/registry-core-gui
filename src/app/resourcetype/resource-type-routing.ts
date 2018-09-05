import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {ResourceTypeListComponent} from './resource-type-list.component';
import {ResourceTypeDetailComponent} from './resource-type-detail.component';
import {NewResourceTypeComponent} from './new-resource-type.component';


const resourceTypeRoutes: Routes = [
  {
    path: 'resourceTypes',
    component: ResourceTypeListComponent
  },
  {
    path: 'resourceTypes/detail/:name',
    component: ResourceTypeDetailComponent
  },
  {
    path: 'resourceTypes/addNewResource',
    component: NewResourceTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(resourceTypeRoutes)],
  exports: [RouterModule]
})

export class ResourceTypeRouting {}
