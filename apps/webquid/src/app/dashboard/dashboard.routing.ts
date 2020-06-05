import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ServiceComponent } from './service/service.component';
import { ProfileComponent } from './profile/profile.component';

const dashboardRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: DashboardComponent
			},{
				path: 'profile',
				component: ProfileComponent
			},{
				path: ':serviceid',
				component: ServiceComponent
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
