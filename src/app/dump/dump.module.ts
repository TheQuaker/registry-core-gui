import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {DumpComponent} from './dump.component';
import {DumpRouting} from './dump-routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DumpRouting
  ],
  declarations: [
    DumpComponent
  ],
  providers: [
  ]
})

export class DumpModule {}
