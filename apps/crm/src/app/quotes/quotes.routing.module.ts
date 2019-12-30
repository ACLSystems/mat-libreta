import { NgModule}  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewQuotesComponent } from './view/view.component';
import { CreateQuoteComponent } from './create/create.component';

const accountRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: ViewQuotesComponent
			},{
				path: 'create',
				component: CreateQuoteComponent
			},{
				path: 'view',
				component: ViewQuotesComponent
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

export class QuotesRoutingModule {}
