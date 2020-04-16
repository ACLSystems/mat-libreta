import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { SuperGuard } from './guards/super.guard';

const superRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: MainComponent,
				canActivate: [SuperGuard]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(superRoutes)
	],
	exports: [
		RouterModule
	]
})

export class SuperRoutingModule { }
