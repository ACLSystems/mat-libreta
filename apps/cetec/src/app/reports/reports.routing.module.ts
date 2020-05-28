import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportsComponent } from './reports.component';
import { DetailsComponent } from './details/details.component';

const reportsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: ReportsComponent
			},{
				path: 'details',
				component: DetailsComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(reportsRoutes)
	],
	exports: [
		RouterModule
	]
})

export class ReportsRoutingModule { }
