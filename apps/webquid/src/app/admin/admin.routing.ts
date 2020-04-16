import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';

import { AdminGuard } from './guards/admin.guard';

const adminRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: MainComponent,
				canActivate: [AdminGuard]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(adminRoutes)
	],
	exports: [
		RouterModule
	]
})

export class AdminRoutingModule { }
