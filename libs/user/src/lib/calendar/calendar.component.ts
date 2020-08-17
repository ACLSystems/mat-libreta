import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CalendarOptions, EventInput } from '@fullcalendar/angular';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import esLocale from '@fullcalendar/core/locales/es';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import {
	UserCourseService,
	CommonService,
	NotElemService
} from '@mat-libreta/shared';

@Component({
	selector: 'mat-libreta-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css'],
	providers: [
		DatePipe
	]
})
export class CalendarComponent implements OnInit {

	loading: boolean;
	rosterType: string;
	id: string;
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
	dateCertificate: any;
	approvalCertificate: boolean;
	startCertificateDate: any;
	course: any = {};
	group: string = '';

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userCourseService: UserCourseService,
		private notElementService: NotElemService,
		private commonService: CommonService,
		private datePipe: DatePipe
	) {
		this.activatedRoute.params.subscribe(params => {
				this.rosterType = params.rostertype;
				this.id = params.id;
				if(this.rosterType !== 'group') {
					this.router.navigate(['/user/content',this.rosterType,this.id]);
					this.notElementService.showNotification(
						'bottom',
						'left',
						'danger',
						'Este curso no tiene calendario. Solo los cursos tutorados tienen calendario.'
					);
				}
			}
		);
	}

	ngOnInit(): void {
		this.loadEvents();
	}

	loadEvents(){
		this.loading = true;
		this.userCourseService.myGroup(this.id,this.rosterType).subscribe(data => {
			// console.log(data);
			if(data && data.message && data.message.course) {
				this.course = data.message.course;
			}
			// console.log(this.course);
			if(data && data.message && data.message.groupCode) {
				this.group = data.message.groupCode;
			}
			if(data && data.message && data.message.dates) {
				this.calendarEvents = data.message.dates.map((event:any) => {
					return {
						title: event.label,
						start: this.datePipe.transform(event.beginDate, 'yyyy-MM-dd'),
						end: this.datePipe.transform(event.endDate, 'yyyy-MM-dd'),
						color: this.colorevents(event.type),
						textColor: this.textcolorevents(event.type),
						type: event.type,
						allDay: true
					}
				});
				this.calendarAllEvents = [...this.calendarEvents];
				this.dateCertificate = this.calendarEvents.find(dateEvent => dateEvent.type === 'certificate');

				if(this.dateCertificate != null) {
					const today = new Date();
					this.startCertificateDate = new Date(this.dateCertificate.start);
					this.approvalCertificate = this.startCertificateDate < today;
					// console.log(this.approvalCertificate);
					this.startCertificateDate = this.datePipe.transform(this.startCertificateDate.toDateString(), 'yyyy-MMM-dd');
					// console.log(this.startCertificateDate);
				} else {
					this.approvalCertificate = true;
				}
				this.calendarOptions.initialEvents = [...this.calendarEvents];
				this.commonService.displayLog('Eventos',this.calendarEvents);
				this.commonService.displayLog('CalendarOptions',this.calendarOptions);
				this.loading = false;
			}
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				text: 'Hubo un error al intentar cargar los eventos del calendario. Intenta nuevamente en unos minutos. Si el problema persiste, repórtalo a la mesa de servicio.'
			});
			this.loading = false;
		});

	}

	colorevents(type: string): string {

		if (type === 'task') {
			return '#00008B';
		}
		if (type === 'exam') {
			return '#DC143C';
		}
		if (type === 'general') {
			return '#228B22';
		}
		if (type === 'certificate') {
			return '#20B2AA';
		}
		return '#FFFFFF';
	}

	textcolorevents(type: string): string {

		if (type === 'task') {
			return '#FFFFFF';;
		}
		if (type === 'exam') {
			return '#FFFFFF';
		}
		if (type === 'general') {
			return '#FFFFFF';
		}
		if (type === 'certificate') {
			return '#FFFFFF';
		}
		return '#000000';
	}

}

// function breakTitle(title, size=12) {
// 	const array = title.split(' ');
// 	var prevWord = '';
// 	var result = '';
//
// 	for(var i=0;i<array.length;i++) {
// 		if(prevWord !== '') {
// 			result = (result.length > 0) ? result + prevWord + ' ' + array[i] + '<br>' : prevWord + ' ' + array[i] + '<br>';
// 			prevWord = '';
// 		} else if(array[i].length < size) {
// 			if(prevWord.length === 0) {
// 				prevWord = array[i];
// 			}
// 		}
// 		if(i === array.length - 1 && prevWord !== '') {
// 			result = result + array[i];
// 		}
// 	}
// 	return result;
// };
