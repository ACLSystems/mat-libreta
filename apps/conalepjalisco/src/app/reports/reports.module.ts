import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

import { ExportAsModule, ExportAsService } from 'ngx-export-as';

import { ReportsRoutingModule } from './reports.routing.module';
import { ReportsComponent } from './reports.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [ReportsComponent, DetailsComponent],
  imports: [
    CommonModule,
		ExportAsModule,
		ReportsRoutingModule,
		ReactiveFormsModule,
		MatSelectModule
  ],
	providers: [
		ExportAsService
	]
})
export class ReportsModule { }
