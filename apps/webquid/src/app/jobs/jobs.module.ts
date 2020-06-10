import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { MaterialModule } from '@wqapp/app.module';
import { JobsComponent } from './jobs/jobs.component';
import { JobComponent } from './job/job.component';

import { JobsService } from '@wqshared/services/jobs.service';

import { JobsRoutingModule } from './jobs.routing';

@NgModule({
  declarations: [JobsComponent, JobComponent],
  imports: [
    CommonModule,
		JobsRoutingModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		DataTablesModule
  ],
	providers: [
		JobsService
	]
})
export class JobsModule { }
