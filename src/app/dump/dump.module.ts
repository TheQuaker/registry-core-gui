import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DumpComponent} from './dump.component';
import {DumpRouting} from './dump-routing';

@NgModule({
  imports: [
    CommonModule,
    DumpRouting
  ],
  declarations: [
    DumpComponent
  ],
  providers: [
  ]
})

export class DumpModule {}
