import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestComponent } from './request/request.component';
import { RequestsComponent } from './requests/requests.component';

const requestsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: RequestsComponent
			},{
				path: 'new',
				component: RequestComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(requestsRoutes)
	],
	exports: [
		RouterModule
	]
})

export class RequestsRoutingModule { }
