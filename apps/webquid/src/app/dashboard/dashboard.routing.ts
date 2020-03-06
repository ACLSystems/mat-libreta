import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { PayrollComponent } from './payroll/payroll.component';
import { ImssComponent } from './imss/imss.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { VacationComponent } from './vacation/vacation.component';
import { OtherComponent } from './other/other.component';
import { Payroll2Component } from './payroll2/payroll2.component';
// import { DemoComponent } from './demo/demo.component';

const dashboardRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: DashboardComponent
			// },{
			// 	path: 'demo',
			// 	component: DemoComponent
			},{
				path: 'payroll',
				component: PayrollComponent
			},{
				path: 'payroll2',
				component: Payroll2Component
			},{
				path: 'imss',
				component: ImssComponent
			},{
				path: 'certificates',
				component: CertificatesComponent
			},{
				path: 'vacation',
				component: VacationComponent,
			},{
				path: 'other',
				component: OtherComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(dashboardRoutes)
	],
	exports: [
		RouterModule
	]
})

export class DashboardRoutingModule { }
