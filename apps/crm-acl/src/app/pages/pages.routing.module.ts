import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';

const pageRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: HomeComponent
			},{
				path: 'home',
				component: HomeComponent
			},{
				path: 'error',
				component: ErrorComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(pageRoutes)
	],
	exports: [
		RouterModule
	]
})

export class PageRoutingModule {}
