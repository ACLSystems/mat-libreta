import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarRoutingModule } from './calendar.routing';
import { AccesoriesModule } from '@mat-libreta/shared';

import { CalendarComponent } from './calendar.component';

@NgModule({
	declarations: [
		CalendarComponent
	],
  imports: [
		CommonModule,
		FullCalendarModule,
		CalendarRoutingModule,
		AccesoriesModule
	]
})
export class CalendarModule {}
