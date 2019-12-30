import { NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateBusinessComponent } from './create/create.component';
import { EditBusinessComponent } from './edit/edit.component';
import { ViewBusinessComponent } from './view/view.component';

const businessRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: ViewBusinessComponent
			},{
				path: 'create',
				component: CreateBusinessComponent
			},{
				path: 'view',
				component: ViewBusinessComponent
			},{
				path: 'edit/:business',
				component: EditBusinessComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(businessRoutes)
	],
	exports: [
		RouterModule
	]
})

export class BusinessRoutingModule {}
