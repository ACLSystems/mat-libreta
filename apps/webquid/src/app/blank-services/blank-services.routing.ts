import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceComponent } from './service/service.component';

const blankRoutes: Routes = [
	{
		path: ':serviceid',
		component: ServiceComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(blankRoutes)
	],
	exports: [
		RouterModule
	]
})

export class BlankRoutingModule { }
