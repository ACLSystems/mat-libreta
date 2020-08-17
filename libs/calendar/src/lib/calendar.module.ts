import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import { CalendarRoutingModule } from './calendar.routing';
import { AccesoriesModule } from '@mat-libreta/shared';

import { CalendarComponent } from './calendar.component';

FullCalendarModule.registerPlugins([
	dayGridPlugin,
	timeGridPlugin,
	listPlugin
]);

@NgModule({
	declarations: [
		CalendarComponent
	],
  imports: [
		CommonModule,
		FullCalendarModule,
		CalendarRoutingModule,
		AccesoriesModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule
	]
})
export class CalendarModule {}
