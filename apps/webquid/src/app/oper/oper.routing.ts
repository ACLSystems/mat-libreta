import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { MassiveComponent } from './massive/massive.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { CompanyComponent } from './company/company.component';
import { OperGuard } from './guards/oper.guard';
import { UsersByCompanyComponent } from './users-by-company/users-by-company.component';

const operRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: MainComponent,
				canActivate: [OperGuard]
			},{
				path: 'massive',
				component: MassiveComponent,
				canActivate: [OperGuard]
			},{
				path: 'deliveries',
				component: DeliveriesComponent,
				canActivate: [OperGuard]
			},{
				path: 'company/:companyid',
				component: CompanyComponent,
				canActivate: [OperGuard]
			},{
				path: 'company/:companyid/users',
				component: UsersByCompanyComponent,
				canActivate: [OperGuard]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(operRoutes)
	],
	exports: [
		RouterModule
	]
})

export class OperRoutingModule { }
