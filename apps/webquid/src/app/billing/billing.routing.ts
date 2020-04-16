import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { BillingGuard } from './guards/billing.guard';

const billingRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: MainComponent,
				canActivate: [BillingGuard]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(billingRoutes)
	],
	exports: [
		RouterModule
	]
})

export class BillingRoutingModule { }
