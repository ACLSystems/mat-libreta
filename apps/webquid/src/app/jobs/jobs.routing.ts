import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobGuard } from './guards/jobs.guard';

import { JobsComponent } from './jobs/jobs.component';
import { JobComponent } from './job/job.component';

const jobsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: JobsComponent,
				canActivate: [JobGuard]
			},
			{
				path: ':jobid',
				component: JobComponent,
				canActivate: [JobGuard]
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(jobsRoutes)
	],
	exports: [
		RouterModule
	]
})

export class JobsRoutingModule { }
