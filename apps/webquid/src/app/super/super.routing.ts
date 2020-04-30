import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { UsersComponent } from './users/users.component';
import { SuperGuard } from './guards/super.guard';

const superRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: MainComponent,
				canActivate: [SuperGuard]
			},
			{
				path: ':companyid',
				component: UsersComponent,
				canActivate: [SuperGuard]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(superRoutes)
	],
	exports: [
		RouterModule
	]
})

export class SuperRoutingModule { }
