import { NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateUserComponent } from './create/create.component';

const userRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'create',
				component: CreateUserComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(userRoutes)
	],
	exports: [
		RouterModule
	]
})

export class UserRoutingModule {}
