import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecoveraccessComponent } from './recoveraccess/recoveraccess.component';
import { ConfirmComponent } from './confirm/confirm.component';

const landingRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'recover/:tokentemp/:username',
				component: RecoveraccessComponent
			},{
				path: 'confirm/:tokentemp/:username',
				component: ConfirmComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(landingRoutes)
	],
	exports: [
		RouterModule
	]
})

export class LandingRoutingModule {}
