import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserpublicComponent } from './userpublic/userpublic.component';

const requesterRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'userpublic',
				component: UserpublicComponent
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
