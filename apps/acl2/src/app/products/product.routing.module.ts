import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FreshserviceComponent } from './freshservice/freshservice.component';
import { FreshworksCRMComponent } from './freshworks-crm/freshworks-crm.component';
import { FreshdeskComponent } from './freshdesk/freshdesk.component';
import { FreshchatComponent } from './freshchat/freshchat.component';
import { FreshcallerComponent } from './freshcaller/freshcaller.component';

const routes: Routes = [
	{

	path:'',
	children: [


		{path: 'freshservice',component: FreshserviceComponent},
		{path: 'freshworks-crm',component: FreshworksCRMComponent},
		{path: 'freshdesk',component: FreshdeskComponent},
		{path: 'freshchat',component: FreshchatComponent},
		{path: 'freshcaller',component: FreshcallerComponent},
	]},
];



@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [RouterModule]
})
export class ProductsRoutingModule {}
