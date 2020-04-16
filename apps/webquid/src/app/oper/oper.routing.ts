import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
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
				path: 'company/:companyid',
				component: MainComponent,
				canActivate: [OperGuard]
			},{
				path: 'company/users/:companyid',
				component: MainComponent,
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
