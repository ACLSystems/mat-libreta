import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgxFilesizeModule } from 'ngx-filesize';

import { MdModule } from '@wqmd/md.module';
import { DashboardRoutingModule } from './dashboard.routing';
import { AccesoriesModule } from '@mat-libreta/shared';

import { DashboardComponent } from './dashboard.component';

// import { BlockCopyPasteDirective } from '@crmshared/directives/protect.directive';

import { HTTPService } from '@mat-libreta/shared';
import { ServiceComponent } from './service/service.component';

import { SN001Component } from './service/sn001/sn001.component';
import { SN001AdminComponent } from './service/sn001-admin/sn001-admin.component';

@NgModule({
  declarations: [
		DashboardComponent,
		ServiceComponent,
		SN001Component,
		SN001AdminComponent
	],
  imports: [
    CommonModule,
		DashboardRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		// MaterialModule,
		MatSelectModule,
		MatInputModule,
		MdModule,
		AccesoriesModule,
		// MatDatepickerModule
		NgxFilesizeModule
  ],
	providers: [
		HTTPService
	]
})
export class DashboardModule { }
