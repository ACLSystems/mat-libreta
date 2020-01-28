import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExamComponent } from './exam/exam.component'

const examRoutes: Routes = [
	{
		path: '',
		component: ExamComponent
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
