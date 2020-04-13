import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ExportAsModule, ExportAsService } from 'ngx-export-as';

import { RequesterRoutingModule } from './requester.routing.module';

import { RequesterService } from './requester.service';

import { UserpublicComponent } from './userpublic/userpublic.component';
import { ReportsPublicComponent } from './reports/reports.component';

@NgModule({
  declarations: [
		UserpublicComponent,
		ReportsPublicComponent
	],
  imports: [
    CommonModule,
		RequesterRoutingModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		ExportAsModule
  ],
	providers: [
		RequesterService,
		ExportAsService
	]
})
export class RequesterModule { }
