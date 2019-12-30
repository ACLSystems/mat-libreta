import { NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewOpportunitiesComponent } from './view/view.component';

const accountRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: ViewOpportunitiesComponent
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

export class OpportunitiesRoutingModule {}
