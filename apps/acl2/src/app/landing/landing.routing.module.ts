import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendlyComponent } from './calendly/calendly.component';


const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'calendly',
				component: CalendlyComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class LandingRoutingModule {}
