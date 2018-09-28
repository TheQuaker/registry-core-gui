import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RestoreComponent} from './restore.component';
import {RestoreRouting} from './restore-routing';

@NgModule({
  imports: [
    CommonModule,
    RestoreRouting
  ],
  declarations: [
    RestoreComponent
  ]
})

export class RestoreModule {}
