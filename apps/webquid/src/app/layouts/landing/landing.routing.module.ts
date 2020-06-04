import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecoveraccessComponent } from './recoveraccess/recoveraccess.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { JobComponent } from './job/job.component';

const landingRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'recovery/:tokentemp',
				component: RecoveraccessComponent
			},{
				path: 'confirm/:tokentemp/:username',
				component: ConfirmComponent
			},{
				path: 'job/:token',
				component: JobComponent
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
