import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourNgBootstrapModule } from 'ngx-tour-ng-bootstrap';

import { AccesoriesModule } from '@mat-libreta/shared';

import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
// import { DemoComponent } from './demo/demo.component';

@NgModule({
	declarations: [
		DashboardComponent,
		// DemoComponent
	],
  imports: [
		CommonModule,
		DashboardRoutingModule,
		FormsModule,
		AccesoriesModule,
		TourNgBootstrapModule
	]
})
export class DashboardModule {}
