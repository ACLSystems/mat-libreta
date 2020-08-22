import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ExportAsModule, ExportAsService } from 'ngx-export-as';
import { CertService } from '../cert/cert.service';

import { RequestComponent } from './request/request.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestsRoutingModule } from './requests.routing.module';
import { RequestService } from './services/requests.service';
import { SpinnerComponent } from './spinner/spinner.component';
import { GroupComponent } from './group/group.component';


@NgModule({
  declarations: [RequestComponent, RequestsComponent, SpinnerComponent, GroupComponent],
  imports: [
    CommonModule,
		RequestsRoutingModule,
		DataTablesModule,
		ExportAsModule,
		FormsModule,
		ReactiveFormsModule
  ],
	providers: [
		RequestService,
		ExportAsService,
		CertService,
		DecimalPipe
	]
})
export class RequestsModule { }
