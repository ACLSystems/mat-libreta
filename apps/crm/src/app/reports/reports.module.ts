import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewReportsComponent } from './view/view.component';

import { ReportRoutingModule } from './reports.routing.module';

@NgModule({
  declarations: [ViewReportsComponent],
  imports: [
    CommonModule,
		ReportRoutingModule
  ]
})
export class ReportsModule { }
