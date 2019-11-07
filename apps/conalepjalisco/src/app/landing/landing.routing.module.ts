import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmComponent } from './confirm/confirm.component';
import { UserConfirmComponent } from './userconfirm/userconfirm.component';
import { LostPassComponent } from './lostpass/lostpass.component';

const landingRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'confirm/:tokentemp/:username/:name/:fathername/:mothername',
				component: ConfirmComponent
			},
			{
				path: 'userconfirm/:tokentemp/:username',
				component: UserConfirmComponent
			},
			{
				path: 'lostpass/:tokentemp/:username',
				component: LostPassComponent
			}
		]
	}
]

@NgModule({
	imports: [
		RouterModule.forChild(landingRoutes)
	],
	exports: [
		RouterModule
	]
})

export class LandingRoutingModule {}
