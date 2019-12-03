import { NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateAccountComponent } from './create/create.component';
import { ViewAccountsComponent } from './view/view.component';

const accountRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'create',
				component: CreateAccountComponent
			},
			{
				path: 'view',
				component: ViewAccountsComponent
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

export class AccountRoutingModule {}
