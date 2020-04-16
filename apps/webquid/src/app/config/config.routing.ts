import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { ConfigGuard } from './guards/config.guard';

const configRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: MainComponent,
				canActivate: [ConfigGuard]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(configRoutes)
	],
	exports: [
		RouterModule
	]
})

export class ConfigRoutingModule { }
