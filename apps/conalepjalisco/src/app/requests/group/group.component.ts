import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CalendarOptions, EventInput } from '@fullcalendar/angular';
// import bootstrapPlugin from '@fullcalendar/bootstrap';
import esLocale from '@fullcalendar/core/locales/es';
import { FormBuilder, Validators } from '@angular/forms';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

import { RequestService } from '../services/requests.service';
import { CertService } from '@cjacert/cert.service';
import { Drawing } from '@cjacert/cert.model';
import { UserCourseService } from '@mat-libreta/shared';

import {
	DtOptions,
	CommonService
} from '@mat-libreta/shared';

interface RubricBlock {
	section: number,
	number: number,
	w: number,
	wq: number,
	wt: number
	title?: string,
	block?: string,
	weight?: number,
	_id?: string
}

interface Display {
	view: string,
	viewValue: string
}

interface BlockDate {
	block: string,
	section: number,
	number: number,
	title?: string
}

@Component({
  selector: 'mat-libreta-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
	providers: [
		DatePipe
	]
})
export class GroupComponent implements OnInit {

	loading: boolean = false;
	loadingGrades: boolean = false;
	loadingRubric: boolean = false;
	groupid: string;
	group: any;
	rubric: {
		course: {
			rubric: RubricBlock[]
		},
		group: {
			code: string,
			name: string,
			_id: string
		},
		rubric: RubricBlock[]
	};
	rubricLoad: boolean = false;
	dtOptions = DtOptions;
	groupRos: any;
	roster: any[] = [];
	certTemplate: string;
	certDrawing: Drawing;
	tableHeaderGroup: string[];
	tableHeaderRubric: string[];
	exportAsConfig: ExportAsConfig = {
		type: 'xlsx',
		elementIdOrContent: 'roster'
	}
	totalStudents: number = 0;
	passStudents: number = 0;
	passPerc: number;
	failedPerc: number;

	calendarWeekends:boolean = true;
	calendarEvents: EventInput[] = [];
	calendarAllEvents: EventInput[] = [];
	calendarOptions: CalendarOptions = {
		// plugins: [ bootstrapPlugin ],
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
		editable: true,
		selectable: true,
		dayMaxEvents: false
	}
	eventTypes: Display[] = [
		{
			view: 'Tarea/Actividad',
			viewValue: 'task'
		},
		{
			view: 'Examen/Evaluación',
			viewValue: 'exam'
		},
		{
			view: 'Liberación de constancia',
			viewValue: 'certificate'
		},
		{
			view: 'General',
			viewValue: 'general'
		},
	]
	eventForm = this.fb.group({
		label: ['',[Validators.required]],
		type: ['',[Validators.required]],
		begin: ['',[Validators.required]],
		beginHour: [''],
		end: ['',[Validators.required]],
		endHour: [''],
		block: ['',[Validators.required]],
		blockDate: ['',[Validators.required]]
	});
	sections: BlockDate[] = [];

  constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private requestService: RequestService,
		private commonService: CommonService,
		private certService: CertService,
		private userCourseService: UserCourseService,
		private exportAsService: ExportAsService,
		private datePipe: DatePipe,
		private fb: FormBuilder
	) {
		this.activatedRoute.params.subscribe(params => {
			this.groupid = params.groupid;
		});
		if(!this.groupid) this.router.navigate(['/requests']);
		this.tableHeaderGroup = [
			'Nombre',
			'Correo',
			'Avance'
		];
		this.tableHeaderRubric = [
			'Sección',
			'Lección',
			'Título',
			'',
			'W',
			'WQ',
			'WT'
		];
		this.loading = true;
		this.getGroup();
	}

	get label() {
		return this.eventForm.get('label');
	}
	get type() {
		return this.eventForm.get('type');
	}
	get begin() {
		return this.eventForm.get('begin');
	}
	get beginHour() {
		return this.eventForm.get('beginHour');
	}
	get end() {
		return this.eventForm.get('end');
	}
	get endHour() {
		return this.eventForm.get('endHour');
	}
	get block() {
		return this.eventForm.get('block');
	}
	get blockDate() {
		return this.eventForm.get('blockDate');
	}

  ngOnInit(): void {}

	getGroup() {
		this.loading = true;
		this.sections = [];
		this.requestService.getGroup(this.groupid).subscribe(data => {
			this.group = Object.assign({},data);
			this.commonService.displayLog('Group Data', this.group);
			this.sections = this.group.rubric.filter(rub => !rub.number).map(rub => {
				return {
					section: rub.section,
					block: rub.block,
					title: rub.title
				}
			})
			this.commonService.displayLog('Sections',this.sections);
			this.getCalendarEvents([...this.group.dates]);
			this.getBlockDatesEvents([...this.group.blockDates]);
			this.getRubric()
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				html: `No pudo descargarse la información del grupo.<br>${error}`
			});
			this.router.navigate(['/requests']);
			this.loading = false;
		})
	}

	getCalendarEvents(events) {
		this.calendarEvents = events.map((event:any) => {
			return {
				title: event.label,
				start: this.datePipe.transform(event.beginDate,'yyyy-MM-dd'),
				end: this.datePipe.transform(event.endDate, 'yyyy-MM-dd'),
				color: this.colorevents(event.type),
				textColor: this.textcolorevents(event.type),
				type: event.type,
				allDay: true
			}
		});
		this.calendarOptions.initialEvents = this.calendarEvents;
		// this.commonService.displayLog('CalendarOptions',this.calendarOptions);
		this.loading = false;
	}

	getBlockDatesEvents(events) {
		const calendarEvents = events.map((event:any) => {
			return {
				title: `${event.section} - ${event.title}`,
				start: this.datePipe.transform(event.date,'yyyy-MM-dd'),
				end: this.datePipe.transform(event.date, 'yyyy-MM-dd'),
				color: this.colorevents('block'),
				textColor: this.textcolorevents('block'),
				type: event.type,
				allDay: true
			}
		});
		this.calendarOptions.initialEvents = this.calendarEvents.concat(calendarEvents);
		// this.commonService.displayLog('CalendarOptions',this.calendarOptions);
		this.loading = false;
	}

	addCalendarEvent() {
		if(!this.label.valid) {
			this.label.markAsDirty();
			this.label.markAsTouched();
			Swal.fire({
				type: 'warning',
				text: 'Agrega la etiqueta del evento'
			})
			return;
		}
		if(!this.type.valid) {
			this.type.markAsDirty();
			this.type.markAsTouched();
			Swal.fire({
				type: 'warning',
				text: 'Agrega el tipo de evento'
			})
			return;
		}
		if(!this.begin.valid) {
			this.begin.markAsDirty();
			this.begin.markAsTouched();
			Swal.fire({
				type: 'warning',
				text: 'Agrega la fecha de inicio del evento'
			})
			return;
		}
		if(!this.end.valid) {
			this.end.markAsDirty();
			this.end.markAsTouched();
			Swal.fire({
				type: 'warning',
				text: 'Agrega la fecha de fin del evento'
			})
			return;
		}
		this.loading = true;
		this.commonService.displayLog(this.beginHour.value,this.endHour.value);
		const event = {
			title: this.label.value,
			type: this.type.value,
			start: addHours(this.begin.value,this.beginHour.value),
			end: addHours(this.end.value,this.endHour.value)
		}
		this.calendarEvents.push(event);
		this.commonService.displayLog('calendarEvents',this.calendarEvents);
		const calendarSend = this.calendarEvents.map(event => {
			return {
				label: event.title,
				type: event.type,
				beginDate: event.start,
				endDate: event.end
			};
		});
		this.commonService.displayLog('Calendario nuevo',calendarSend);
		this.requestService.addDates(this.groupid,calendarSend).subscribe(() => {
			// console.log(data);
			setTimeout(() => {
				this.getGroup();
			}, 305);
		}, error => {
			Swal.fire({
				type: 'error',
				text: 'Ocurrió un error en el envío'
			})
			this.loading = false;
			console.log(error);
		});
	}

	addBlockDates() {
		if(!this.block.valid) {
			this.block.markAsDirty();
			this.block.markAsTouched();
			Swal.fire({
				type: 'warning',
				text: 'Agrega la sección a bloquear'
			})
			return;
		}
		if(!this.blockDate.valid) {
			this.blockDate.markAsDirty();
			this.blockDate.markAsTouched();
			Swal.fire({
				type: 'warning',
				text: 'Agrega la fecha de la sección a bloquear'
			})
			return;
		}
		const blockDate = this.datePipe.transform(this.blockDate.value,'yyyy-MM-dd') + ' 05:00';
		this.loading = true;
		this.commonService.displayLog('Bloque',this.block.value);
		this.commonService.displayLog('Fecha bloqueo',blockDate);
		var blockDates = [...this.group.blockDates];
		if(blockDates.length > 0) {
			blockDates = blockDates.map(block => {
				return {
					block: block.block,
					date: this.datePipe.transform(block.date,'yyyy-MM-dd') + ' 05:00'
				}
			})
		}
		blockDates.push({
			block: this.block.value,
			date: blockDate
		});
		this.commonService.displayLog('blockDates',blockDates);
		this.requestService.addBlockDates(this.groupid,blockDates).subscribe(() => {
			// console.log(data);
			this.block.reset('');
			this.blockDate.reset('');
			setTimeout(() => {
				this.getGroup();
			}, 305);
		}, error => {
			Swal.fire({
				type: 'error',
				text: 'Ocurrió un error en el envío'
			})
			this.loading = false;
			console.log(error);
		})
	}

	changeTutor() {
		Swal.fire({
			title: `Cambio de instructor para el grupo ${this.group.code}`,
			text: 'Nota: El instructor ya debe estar registrado en plataforma',
			inputPlaceholder: 'Correo del instructor',
			input: 'email',
		}).then(email => {
			if(email.value) {
				Swal.fire({
					text: 'Espera...',
					allowOutsideClick: () => !Swal.isLoading()
				});
				Swal.showLoading();
				this.requestService.validateInstructor(email.value).subscribe(data => {
					const instructor:any = data;
					if(instructor.message && instructor.message.includes('Usuario no existe')){
						Swal.fire({
							type: 'error',
							html: `Usuario <b>${email.value}</b> no existe`
						});
						return;
					}
					if(instructor.message && instructor.message.includes('No autorizado')) {
						Swal.fire({
							type: 'error',
							text: 'No estás autorizado a realizar esta operación'
						});
						return;
					}
					this.requestService.changeInstructor(this.groupid,instructor._id).subscribe(data => {
						this.getGroup();
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'success',
							text: data.message
						});
					}, error => {
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'error',
							text: `Hubo un error en la consulta: ${error.error.message}`
						});
						console.log(error);
					});
				}, error => {
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'error',
						text: `Hubo un error en la consulta: ${error.error.message}`
					});
					console.log(error);
				});
			}
		});
	}

	getRubric() {
		if(this.rubricLoad) {
			return;
		}
		Swal.fire('Espera...');
		Swal.showLoading();
		this.loadingRubric = true;
		this.requestService.getRubric(this.groupid).subscribe(data => {
			// console.log(data);
			this.rubric = data;
			this.rubric.rubric = calculateRubric(this.rubric.rubric);
			this.loadingRubric = false;
			this.rubricLoad = true;
			calculateRubric(this.rubric.rubric);
			Swal.hideLoading();
			Swal.close();
		}, error => {
			console.log(error);
			this.loadingRubric = false;
			Swal.hideLoading();
			Swal.close();
		});
	}

	getGrades() {
		if(this.roster.length > 0) {
			return;
		}
		this.loadingGrades = true;
		this.requestService.getGradesforGroup(this.groupid).subscribe(data => {
			this.groupRos = data;
			this.commonService.displayLog('Group Roster',this.groupRos);
			this.roster = this.groupRos.roster;
			if(this.groupRos.displayRFC) this.tableHeaderGroup.unshift('RFC');
			this.tableHeaderGroup = [...this.tableHeaderGroup, ...this.roster[0].grades.map(grade => grade.blockTitle)];
			this.tableHeaderGroup.push('Calificación Final');
			this.tableHeaderGroup.push('#Constancia');
			this.tableHeaderGroup.push('Constancia');
			this.loadingGrades = false;
			this.totalStudents = this.roster.length;
			this.passStudents = this.roster.filter(ros => ros.pass).length;
			this.passPerc = round((this.passStudents / this.totalStudents) * 100,2);
			this.failedPerc =  round(((this.totalStudents - this.passStudents) / this.totalStudents) * 100,2);
			this.getTemplate();
		}, error => {
			console.log(error);
			this.loadingGrades = false;
		})
		localStorage.removeItem('massCertChunk');
	}

	getTemplate() {
		if(this.certTemplate) {
			return;
		}
		this.loadingGrades= true;
		let rosterid = null;
		let navigate = 0;
		while(!rosterid && navigate < this.roster.length) {
			if(this.roster[navigate].pass) rosterid = this.roster[navigate].rosterid;
			navigate ++;
		}
		if(!rosterid) {
			Swal.fire({
				type:'warning',
				html:'Por el momento no hay aprobados por lo que no se ha descargado la plantilla de constancia'
			});
		}
		Swal.fire('Espera...');
		Swal.showLoading();
		this.userCourseService.getCertTemplate(rosterid).subscribe(data => {
			this.certTemplate = data.data;
			this.certDrawing = data.drawing;
			this.loadingGrades = false;
			Swal.hideLoading();
			Swal.close();
		}, error => {
			console.log(error);
			this.loadingGrades = false;
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type:'error',
				html: `<p>No se pudo descargar la plantilla de constancia</p>${error}`
			});
		})
	}

	modifyGroup(field:string) {
		// console.log(field);
		if(field.includes('beginDate') || field.includes('endDate')) {
			const now = new Date();
			const months = [
				'Enero','Febrero','Marzo','Abril',
				'Mayo','Junio','Julio','Agosto',
				'Septiembre','Octubre','Noviembre','Diciembre'
			];
			var monthsString = '';
			const month = now.getMonth();
			for(var i=0;i<months.length;i++) {
				monthsString += (i === month) ? `<option value="${month+1}" selected>${months[i]}</option>
				` : `<option value="${i+1}">${months[i]}</option>
				`
			}
			Swal.fire({
				title: 'Selecciona la fecha',
				html: `<input type="number" id="day" value="${+now.getDate()}"><br>
				<select id="month">
					${monthsString}
				</select><br>
				<input type="number" id="year" value="${+now.getFullYear()}">`,
				showConfirmButton: true,
				confirmButtonText: 'Cambiar',
				confirmButtonColor: 'green',
				showCancelButton: true,
				cancelButtonText: 'Cancelar',
				cancelButtonColor: 'red',
				preConfirm: () => {
					return [
						(<HTMLInputElement>document.getElementById('day')).value,
						(<HTMLInputElement>document.getElementById('month')).value,
						(<HTMLInputElement>document.getElementById('year')).value
					];
				}
			}).then((results) => {
				if(results.dismiss) {
					// console.log('Bye');
					return;
				}
				// console.log(results.value);
				Swal.fire('Espera...');
				Swal.showLoading();
				var groupToSend = {};
				if(field.includes('beginDate') || field.includes('endDate')) {
					const [day,month,year] = results.value;
					const newDate = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')} 00:00`;
					// console.log(newDate);
					groupToSend[field] = (field.includes('beginDate') || field.includes('endDate')) ? new Date(newDate) : '';;
				}
				this.requestService.modifyGroup(this.groupid,groupToSend).subscribe(data => {
					Swal.hideLoading();
					Swal.close();
					if(data.message) {
						Swal.fire({
							type: 'warning',
							text: data.message
						});
					} else {
						this.group = data;
						Swal.fire({
							type: 'success',
							text: 'Fecha modificada'
						});
					}
				}, error => {
					console.log(error);
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'error',
						text: error.error.message
					})
				});
			})
		}
	}


	printCert(index:number) {
		const roster = this.roster[index];
		const endDate = this.groupRos.presentedEndDate === 'endDate' ?
			this.groupRos.endDateSpa
		: this.groupRos.presentedEndDate === 'passDate' ?
			roster.passDateSpa
		: this.groupRos.otherEndDateSpa;
		console.log(endDate);
		const period = this.certDrawing.period && this.certDrawing.period.enabled ?
			`${this.groupRos.beginDateSpa} al ${this.groupRos.endDateSpa}`: null;
		this.certService.printCertificate(
			this.certDrawing,
			this.certTemplate,
			(roster.certificateNumber+'').padStart(6,'0'),
			`${roster.name} ${roster.fatherName} ${roster.motherName}`,
			this.groupRos.course,
			roster.finalGrade + '',
			this.groupRos.courseDuration + '',
			this.groupRos.courseDurUnits,
			endDate,
			true,
			period
		)
	}

	printMassive() {
		const roster = this.roster.map((ros,index) => {
			return {
				pass: ros.pass,
				index
			}
		}).filter(ros => ros.pass);
		for(let i=0; i < roster.length; i++) {
			setTimeout(() => {
				this.printCert(roster[i].index);
				if(!i) {
					Swal.fire({
						type: 'info',
						html: `<p class="text-center">Comenzarán a descargarse ${roster.length} constancias una por una</p>
						<h1 class="text-center text-danger">NO CIERRES EL NAVEGADOR</h1><h3>Te avisaremos cuando hayan terminado las descargas</h3><p class="text-center">Este anuncio sí lo puedes cerrar</p>`
					})
				}
				if(i + 1 === roster.length) {
					Swal.fire({
						type: 'info',
						text: 'Se han terminado de descargar las constancias'
					})
				}
			},2000*i);
		}
	}

	export() {
		this.exportAsService.save(this.exportAsConfig, this.group.code).subscribe(() => {});
	}

	calculateRubric(section: number, number: number, mod: number) {
		const foundEntry = this.rubric.rubric.findIndex(e => e.section === section && e.number === number);
		if(foundEntry > -1) {
			const currentValue = this.rubric.rubric[foundEntry].w
			if(currentValue === 0 && mod < 0) {
				Swal.fire({
					type: 'warning',
					text: 'Valores menores a cero no son válidos'
				});
				return;
			}
			this.rubric.rubric[foundEntry].w += +mod;
		}
		this.rubric.rubric = calculateRubric(this.rubric.rubric);
	}

	resetRubric() {
		Swal.fire('Espera...');
		Swal.showLoading();
		this.requestService.resetRubric(this.groupid).subscribe(data => {
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'success',
				text: data.message
			});
			this.getRubric();
		}, error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				text: error.error.message
			});
		});
	}

	setRubric() {
		Swal.fire('Espera...');
		Swal.showLoading();
		this.requestService
			.setRubric(this.groupid,this.rubric.rubric).subscribe(data => {
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'success',
					text: data.message
				});
				this.getRubric();
			}, error => {
				console.log(error);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					text: error.error.message
				});
			})
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
		if (type === 'block') {
			return '#FF8C00'
		}
		return '#FFFFFF';
	}

	textcolorevents(type: string): string {
		console.log('textColor',type);
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
		if (type === 'block') {
			return '#FFFFFF'
		}
		return '#000000';
	}
}

function calculateRubric(rubric: any[]) {
	if(!Array.isArray(rubric)) {
		return rubric;
	}
	rubric.forEach(e => e.weight = 0);
	var sections = rubric.map((item:any) => item.section);
	var sectionW = rubric.filter((item:any) => item.number === 0).map(item => item.w);
	sections = [... new Set(sections)];
	// console.log('Sections:');
	// console.log(sections);
	// console.log('SectionsW:');
	// console.log(sectionW);
	const overallSections = sectionW.reduce((acc,value) => acc + value, 0);
	if(overallSections === 0) {
		return rubric;
	}
	// console.log('Overall', overallSections);

	for(var i=0;i<sections.length;i++) {
		// nos vamos sección por sección y calculamos el 100% de cada sección
		var totalNumbers = rubric.filter(item => item.section === i && item.number !== 0);
		// console.log('totalNumbers');
		// console.log(totalNumbers);
		var totalSection = totalNumbers.reduce((acc,value) => acc + value.w, 0);
		// console.log('totalSection:',totalSection);
		if(totalSection > 0) {
			// console.log('Sección: ', i, 'Total', totalSection);
			for(let entry of totalNumbers) {
				var foundEntry = rubric.findIndex(e => e.section === entry.section && e.number === entry.number);
				if(foundEntry > -1) {
					rubric[foundEntry].weight = round(100 * rubric[foundEntry].w / totalSection, 2);
					// console.log('i',i,'W',rubric[foundEntry].w, totalSection,100 * rubric[foundEntry].w / totalSection)
				}
			}
		}
		var foundSection = rubric.findIndex(s => s.section === i && s.number === 0);
		if(foundSection > -1) {
			rubric[foundSection].weight = round(100 * +rubric[foundSection].w / overallSections, 2);
		}
	}
	// console.log(rubric);
	return rubric;
}

function round(num:number, places?:number) {
	if(!places) {
		return Math.round(num);
	} else {
		let val = Math.pow(10, places);
		return Math.round(num*val) / val;
	}
}

function addHours(time: any, h:string) {
	const hs = h || '0:0';
	console.log('addHours',hs);
	const newTime = new Date(time);
	const [hours,mins] = hs.split(':');
	newTime.setTime(newTime.getTime() + (((+hours * 3600) + (+mins * 60)) * 1000));
	return newTime;
}
