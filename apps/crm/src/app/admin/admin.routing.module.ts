import { NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin.component';

const accountRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: AdminComponent
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

export class AdminRoutingModule {}
