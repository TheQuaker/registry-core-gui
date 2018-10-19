import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';

import {DashboardComponent} from './dashboard/dashboard.component';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  // {
  //   path: 'resources',
  //   loadChildren: './resource/resource.module#ResourceModule',
  //   runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: 'resource/detail/:resourceType/:id',
  //   loadChildren: './resource/resource.module#ResourceModule'
  // },
  // {
  //   path: 'resources/addNewResource',
  //   loadChildren: './resource/resource.module#ResourceModule'
  // },
  // {
  //   path: 'resource/updateResource/:resourceType/:id',
  //   loadChildren: './resource/resource.module#ResourceModule'
  // },
  // {
  //   path: 'resourceTypes',
  //   loadChildren: './resourcetype/resource-type.module#ResourceTypeModule'
  // },
  // {
  //   path: 'resourceTypes/detail/:name',
  //   loadChildren: './resourcetype/resource-type.module#ResourceTypeModule'
  // },
  {
    path: 'dump',
    loadChildren: './dump/dump.module#DumpModule'
  },
  {
    path: 'restore',
    loadChildren: './restore/restore.module#RestoreModule'
  },
  {
    path: '400',
    loadChildren: './errorcodes/error-codes.module#ErrorCodesModule'
  },
  // {
  //   path: '404',
  //   loadChildren: './errorcodes/error-codes.module#ErrorCodesModule'
  // },
  {
    path: '**',
    redirectTo: '/404'
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})
  ],
  declarations: [],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
