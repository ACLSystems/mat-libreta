import { NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateUserComponent } from './create/create.component';
import { ViewUserComponent } from './view/view.component';
import { EditUserComponent } from './edit/edit.component';

const userRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'create',
				component: CreateUserComponent
			},{
				path: 'view',
				component: ViewUserComponent
			},{
				path: 'edit/:user',
				component: EditUserComponent
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
