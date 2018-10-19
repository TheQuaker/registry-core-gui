import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ModalModule} from 'ngx-bootstrap';

import {DumpComponent} from './dump.component';
import {DumpRouting} from './dump-routing';
import {DumpService} from '../services/dump.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    DumpRouting
  ],
  declarations: [
    DumpComponent
  ],
  providers: [
    DumpService
  ]
})

export class DumpModule {}
