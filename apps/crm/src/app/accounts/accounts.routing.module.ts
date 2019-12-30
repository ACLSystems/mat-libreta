import { NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateAccountComponent } from './create/create.component';
import { ViewAccountsComponent } from './view/view.component';
import { EditAccountComponent } from './edit/edit.component';

const accountRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: ViewAccountsComponent
			},{
				path: 'create',
				component: CreateAccountComponent
			},{
				path: 'view',
				component: ViewAccountsComponent
			},{
				path: 'edit/:user',
				component: EditAccountComponent
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
