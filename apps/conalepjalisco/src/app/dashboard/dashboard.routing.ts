import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DemoComponent } from './demo/demo.component';

const dashboardRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: DashboardComponent
			},{
				path: 'demo',
				component: DemoComponent
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
