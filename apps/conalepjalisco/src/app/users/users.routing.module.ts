import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersComponent } from './users/users.component';

const usersRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: UsersComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(usersRoutes)
	],
	exports: [
		RouterModule
	]
})

export class UsersRoutingModule { }
