import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { RequestComponent } from './request/request.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestsRoutingModule } from './requests.routing.module';

import { RequestService } from './services/requests.service';


@NgModule({
  declarations: [RequestComponent, RequestsComponent],
  imports: [
    CommonModule,
		RequestsRoutingModule,
		DataTablesModule
  ],
	providers: [
		RequestService
	]
})
export class RequestsModule { }
