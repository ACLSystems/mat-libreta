import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserpublicComponent } from './userpublic/userpublic.component';
import { ReportsPublicComponent } from './reports/reports.component';

const requesterRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'userpublic',
				component: UserpublicComponent
			},{
				path: 'reportspublic',
				component: ReportsPublicComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(requesterRoutes)
	],
	exports: [
		RouterModule
	]
})

export class RequesterRoutingModule { }
