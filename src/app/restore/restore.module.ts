import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ModalModule} from 'ngx-bootstrap/modal';

import {RestoreComponent} from './restore.component';
import {RestoreRouting} from './restore-routing';
import {RestoreService} from '../services/restore.service';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    RestoreRouting
  ],
  declarations: [
    RestoreComponent
  ],
  providers: [
    RestoreService
  ]
})

export class RestoreModule {}
