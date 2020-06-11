import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CertComponent } from './cert.component';
import { CertGuard } from '@mat-libreta/shared'

const certRoutes: Routes = [
	{
		path: '',
		children:[
			{
				path: ':rostertype/:id',
				component: CertComponent,
				canActivate: [CertGuard]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(certRoutes)
	],
	exports: [
		RouterModule
	]
})

export class CertRoutingModule {}
