import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarRoutingModule } from './calendar.routing';
import { MaterialModule } from '@cjaapp/app.module';
import { AccesoriesModule } from '@cjashared/accesories/accesories.module';

import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
	declarations: [
		CalendarComponent
	],
	imports: [
		CommonModule,
		MaterialModule,
		FullCalendarModule,
		CalendarRoutingModule,
		AccesoriesModule
	]
})
export class CalendarModule { }
