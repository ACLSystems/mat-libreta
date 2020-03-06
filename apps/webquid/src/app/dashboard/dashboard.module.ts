import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MaterialModule } from '@wqapp/app.module';
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

@NgModule({
  declarations: [
		DashboardComponent,
		PayrollComponent,
		ImssComponent,
		VacationComponent,
		CertificatesComponent,
		OtherComponent,
		Payroll2Component,
		// DemoComponent,
		// BlockCopyPasteDirective
	],
  imports: [
    CommonModule,
		DashboardRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		MdModule,
		AccesoriesModule,
		MatDatepickerModule
  ],
	providers: [
		HTTPService
	]
})
export class DashboardModule { }
