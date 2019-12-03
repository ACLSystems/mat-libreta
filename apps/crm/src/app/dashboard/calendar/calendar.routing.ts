import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';

const calendarRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: CalendarComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(calendarRoutes)
	],
	exports: [
		RouterModule
	]
})

export class CalendarRoutingModule {}
