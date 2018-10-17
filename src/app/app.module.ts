import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {DumpModule} from './dump/dump.module';
import {RestoreModule} from './restore/restore.module';
import {ResourceModule} from './resource/resource.module';
import {AppRoutingModule} from './app-routing.module';
import {ErrorCodesModule} from './errorcodes/error-codes.module';
import {ResourceTypeModule} from './resourcetype/resource-type.module';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    ResourceModule,
    ResourceTypeModule,
    DumpModule,
    RestoreModule,
    ErrorCodesModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
