import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportAsModule, ExportAsService } from 'ngx-export-as';

import { ReportsRoutingModule } from './reports.routing.module';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
		ExportAsModule,
		ReportsRoutingModule
  ],
	providers: [
		ExportAsService
	]
})
export class ReportsModule { }
