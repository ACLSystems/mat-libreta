import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FreshserviceComponent } from './freshservice/freshservice.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'freshservice',
				component: FreshserviceComponent
			}
		],
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [RouterModule]
})
export class ProductsRoutingModule {}
