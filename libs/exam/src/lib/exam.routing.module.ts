import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExamComponent } from './exam/exam.component'

const examRoutes: Routes = [
	{
		path: ':rostertype/:id/:blockid',
		component: ExamComponent
	},{
		path: '**',
		redirectTo: '/dashboard'
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(examRoutes)
	],
	exports: [
		RouterModule
	]
})

export class ExamRoutingModule {}
