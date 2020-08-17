import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CalendarOptions, EventInput } from '@fullcalendar/angular';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import esLocale from '@fullcalendar/core/locales/es';

import {
	Identity,
	UserService,
	CommonService
} from '@mat-libreta/shared';

import { EventService } from './event.service';


@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss'],
	providers: [
		UserService,
		EventService,
		DatePipe
	]
})
export class CalendarComponent implements OnInit {

	identity: Identity;
	token: string;
	loading: boolean;
	// calendarPlugins = [
	// 	dayGridPlugin,
	// 	timeGridPlugin,
	// 	listPlugin];
	colorevents: any[];
	calendarWeekends:boolean = true;
	calendarEvents: EventInput[] = [];
	calendarAllEvents: EventInput[] = [];
	calendarOptions: CalendarOptions = {
		plugins: [ bootstrapPlugin ],
		themeSystem: 'bootstrap',
		locale: esLocale,
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
		},
		initialView: 'dayGridMonth',
		initialEvents: this.calendarEvents,
		weekends: true,
		editable: false,
		selectable: false,
		dayMaxEvents: false
	}
	eventSelected: string;
	eventSelectedStart: Date;
	eventSelectedEnd: Date;

	constructor(
		private userService: UserService,
		private commonService: CommonService,
		private eventService: EventService,
		private datePipe: DatePipe,
		private router: Router
	) {
		this.token = this.userService.getToken();
		this.identity = this.userService.getidentity();
		this.colorevents = this.commonService.getEnvironment().colorEvents;
	}

	ngOnInit() {
		if(this.token === null && this.identity === null) {
			this.router.navigate(['/pages/login']);
		} else {
			this.loadEvents();
		}
	}

	loadEvents(){
		this.loading = true;
		const colorEvents = [
			'event-azure',
			'event-green',
			'event-orange',
			'event-red',
			'event-azure',
			'event-green',
			'event-orange',
			'event-red',
			'event-azure',
			'event-green',
			'event-orange',
			'event-red'
		]
		this.eventService.getEventSchedule().subscribe(res => {
			var lastColor = '';
			// console.log('Hola');
			// this.commonService.displayLog('Res',res);
			if(res &&
				res.message &&
				res.message.groups &&
				Array.isArray(res.message.groups) &&
				res.message.groups.length > 0
			) {
				// console.group('respuesta');
				// console.log(res.message.groups);
				// console.groupEnd();
				for (const id of res.message.groups){
					let classColor = colorEvents[Math.floor(Math.random()*colorEvents.length)];
					while (classColor == lastColor) {
						classColor = colorEvents[Math.floor(Math.random()*colorEvents.length)];
					}
					lastColor = classColor;
					this.calendarEvents.push({
						title: (id.rosterType === 'group') ? `Grupo ${id.code} del curso ${id.course}` : `Curso: ${id.course}`,
						start: this.datePipe.transform(id.beginDate, 'yyyy-MM-dd'),
						end: this.datePipe.transform(id.endDate, 'yyyy-MM-dd'),
						className: classColor
						// textColor: environment.textColor
					});
				}
				this.calendarAllEvents = [...this.calendarEvents];
				this.commonService.displayLog('Eventos calendario',this.calendarAllEvents);
			}
			this.loading = false;
		});
	}

}
