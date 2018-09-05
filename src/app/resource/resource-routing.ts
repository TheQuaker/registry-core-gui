import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {ResourceListComponent} from './resource-list.component';
import {ResourceDetailComponent} from './resource-detail.component';
import {NewResourceComponent} from './new-resource.component';
import {UpdateResourceComponent} from './update-resource.component';


const resourcesRoutes: Routes = [
  {
    path: 'resources',
    component: ResourceListComponent,
  },
  {
    path: 'resources/detail/:resourceType/:id',
    component: ResourceDetailComponent
  },
  {
    path: 'resources/addNewResource',
    component: NewResourceComponent
  },
  {
    path: 'resources/updateResource/:resourceType/:id',
    component: UpdateResourceComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(resourcesRoutes)],
  exports: [RouterModule]
})

export class ResourceRouting {}
