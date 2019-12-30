import { NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewReportsComponent } from './view/view.component';

const accountRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: ViewReportsComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(accountRoutes)
	],
	exports: [
		RouterModule
	]
})

export class ReportRoutingModule {}
