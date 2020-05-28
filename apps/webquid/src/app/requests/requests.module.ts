import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { RequestsComponent } from './requests/requests.component';

import { RequestsRoutingModule } from './requests.routing.module';

@NgModule({
  declarations: [RequestsComponent],
  imports: [
    CommonModule,
		RequestsRoutingModule,
		DataTablesModule
  ]
})
export class RequestsModule { }
