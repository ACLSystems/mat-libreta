import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportsComponent } from './reports.component';
// import { DemoComponent } from './demo/demo.component';

const reportsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: ReportsComponent
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
