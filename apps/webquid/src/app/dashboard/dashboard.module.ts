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
import { PayrollComponent } from './payroll/payroll.component';
import { ImssComponent } from './imss/imss.component';
import { VacationComponent } from './vacation/vacation.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { OtherComponent } from './other/other.component';
import { Payroll2Component } from './payroll2/payroll2.component';
// import { DemoComponent } from './demo/demo.component';

// import { BlockCopyPasteDirective } from '@crmshared/directives/protect.directive';

import { HTTPService } from '@mat-libreta/shared';
import { ServiceComponent } from './service/service.component';
import { SN001Component } from './service/sn001/sn001.component';
import { SN001AdminComponent } from './service/sn001-admin/sn001-admin.component';

@NgModule({
  declarations: [
		DashboardComponent,
		PayrollComponent,
		ImssComponent,
		VacationComponent,
		CertificatesComponent,
		OtherComponent,
		Payroll2Component,
		ServiceComponent,
		SN001Component,
		SN001AdminComponent,
		// DemoComponent,
		// BlockCopyPasteDirective
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
