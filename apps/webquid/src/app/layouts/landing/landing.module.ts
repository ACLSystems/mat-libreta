import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LandingRoutingModule } from './landing.routing.module';
import { RecoveraccessComponent } from './recoveraccess/recoveraccess.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { JobComponent } from './job/job.component';

import { CVService } from './services/cv.service';

@NgModule({
  declarations: [
		RecoveraccessComponent,
		ConfirmComponent,
		JobComponent
	],
  imports: [
    CommonModule,
		LandingRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatInputModule,
		MatDatepickerModule
  ],
	providers: [
		CVService
	]
})
export class LandingModule { }
