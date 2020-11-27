import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FreshserviceComponent } from './freshservice/freshservice.component';
import { FreshworksCRMComponent } from './freshworks-crm/freshworks-crm.component';

const routes: Routes = [
	{

	path:'',
	children: [


		{path: 'freshservice',component: FreshserviceComponent},
		{path: 'freshworks-crm',component: FreshworksCRMComponent},
	]},
];



@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [RouterModule]
})
export class ProductsRoutingModule {}
