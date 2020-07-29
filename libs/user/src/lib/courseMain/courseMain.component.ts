import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import Swal from 'sweetalert2';

declare const $: any;

import {
	UserService,
	UserCourseService,
	WindowService,
	CommService,
	CommonService,
	Section
} from '@mat-libreta/shared';



registerLocaleData(localeMX);

@Component({
	selector: 'app-course-main',
	templateUrl: './courseMain.component.html',
	styleUrls: ['./courseMain.component.scss'],
	providers: [
		UserService,
		UserCourseService,
		WindowService,
		CommService,
		{ provide: LOCALE_ID, useValue: 'es-MX'}
	]
})
export class CourseMainComponent implements OnInit {

	loading: boolean = true;
	id: string;
	rosterType: string;
	userid: string;
	content: any;
	blocks: any[] = [];
	sections: Section[] = [];
	courseStarted: boolean = false;
	track: number = 0;
	finalGrade: number;
	bank: string;
	bankAccount: string;
	bankCLABE: string;
	mocAmount: string;
	notification: any;
	today: Date = new Date();

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userCourseService: UserCourseService,
		// private commService: CommService,
		private commonService: CommonService
	) {
		this.loading = true;
		this.activatedRoute.params.subscribe(params => {
			this.rosterType = params.rostertype;
			this.id = params.id;
		});
		this.userid = this.commonService.getidentity().userid;
		this.bank = this.commonService.getEnvironment().bank;
		this.bankAccount = this.commonService.getEnvironment().bankAccount;
		this.bankCLABE = this.commonService.getEnvironment().bankCLABE;
		this.mocAmount = this.commonService.getEnvironment().mocAmount;
	}

	ngOnInit() {
		this.loading = true;
		this.getGroup();
		// const that = this;
		// setTimeout(function() {
		// 	that.commService.sendMessage(that.userid,'Conectado');
		// 	that.commService.getMessage(that.userid).subscribe(data => {
		// 		console.log(data);
		// 		const now = new Date();
		// 		that.commService.sendMessage(that.userid,now);
		// 	});
		// }, 801);
	}


	getGroup() {
		this.userCourseService.myGroup(this.id, this.rosterType).subscribe(data => {
			const notFoundMessage = `Group with id -${this.id}- not found`;
			// console.log(data);
			if(data.message && data.message == notFoundMessage) {
				Swal.fire({
					title: 'Curso/Grupo no encontrado',
					text: 'Por favor selecciona un curso en el panel',
					type: 'error',
					confirmButtonText: 'Ok',
					confirmButtonClass: 'btn btn-danger'
				});
				this.router.navigate(['/dashboard']);
			} else {
				this.content = data.message;
				this.content.bd = new Date(this.content.beginDate);
				this.content.ed = new Date(this.content.endDate);
				const now = new Date();
				// console.group('content');
				// console.log(this.content);
				if(this.content.ed < now) {
					// console.log('se supone que está cerrado')
					if(this.content.openStatus === 'active') {
						// deberiamos cerrar el curso
						this.content.openStatus = 'closed'
					}
				}
				// console.groupEnd();
				if(this.content.blocks && Array.isArray(this.content.blocks) && this.content.blocks.length > 0) {
					this.blocks = [...this.content.blocks];
				}
				this.commonService.displayLog('Blocks',this.blocks);
				this.sections = getUniques(this.blocks);
				// console.group('sections');
				// console.log(this.sections);
				// console.groupEnd();
				this.track = parseInt(this.content.track.split('%')[0]);
				//console.log(this.track);
				this.finalGrade = this.content.finalGrade ? this.content.finalGrade : 0;
				if(this.content && this.content.course && this.content.course.moocPrice) {
					this.mocAmount = `$ ${this.content.course.moocPrice} MXN`
				}
				this.loading = false;
			}
		}, error => {
			Swal.fire({
				type: 'error',
				title: 'Error de comunicación con el servidor',
				text: 'El servidor nos respondió con un error. Puede ser temporal, por lo que te sugerimos intentar nuevamente en un minuto.',
				footer: 'En caso de que este error se presente continuamente, favor de reportarlo a soporte@soporte con este número de error: 1234'
			});
			console.log(error);
		});
	}

	getBlock(blockid: string, seen: boolean, force?: boolean,) {
		if(!seen) {
			Swal.fire({
				type: 'warning',
				title: 'La lección no ha sido abierta',
				html: '<div class="container"><div class="row"><div class="col"><p class="text-justify">Para verla tienes que ir a la última <span class="text-success">lección vista (en verde)</span> (o sección si es el caso) y presionar el botón </p></div></div><div class="row"><div class="col text-center"><button mat-raised-button class="btn btn-sm btn-success float-right">Siguiente <i class="material-icons">chevron_right</i></button></div></div><div class="row"><div class="col"><p class="text-justify">Tip: Si el título de la unidad está en verde, presiónalo para continuar.</p><p class="text-justify">También es posible que la lección que quieres ver esté bloqueda por lo que te sugerimos revisar el calendario.</p></div></div></div>'
			});
			return;
		}
		if(this.content.openStatus !== 'closed') {
			var currentCourse = JSON.parse(localStorage.getItem('currentCourse'));
			if(currentCourse) {
				currentCourse.block = currentCourse.block ? blockid : currentCourse.block;
				localStorage.setItem('currentCourse',JSON.stringify(currentCourse));
			}
			if(this.track || force) {
				this.router.navigate(['/user/block', this.rosterType, this.id, blockid]);
			}
			return;
		}
		Swal.fire({
			type: 'info',
			text: 'El curso se encuentra cerrado'
		});
	}

	seeLessonNumberHelp() {
		Swal.fire({
			title: 'Columna #',
			type: 'info',
			html: 'Esta columna muestra el número de lección.'
		});
	}

	seenHelp() {
		Swal.fire({
			title: 'Columna Visto',
			type: 'info',
			html: 'Esta columna muestra si ya has visto la lección. <br>' +
			'El ícono: <i class="material-icons">visibility_off</i> indica que no has visto la lección.<br>' +
			'El ícono: <i class="material-icons text-success">visibility</i> indica que ya has visto la lección.<br>' +
			'<span class="text-success">Además, todo el renglón se pone de color verde si ya viste la lección.</span>'
		});
	}

	typeHelp() {
		Swal.fire({
			title: 'Columna Tipo',
			type: 'info',
			html: 'Esta columna muestra el tipo de la lección. <br>' +
			'El ícono: <i class="material-icons">theaters</i> indica que la lección contiene video.<br>' +
			'El ícono: <i class="material-icons">label</i> indica que la lección es de lectura solamente.<br>' +
			'El ícono: <i class="material-icons">ballot</i> indica que la lección contiene un examen/cuestionario.<br>' +
			'El ícono: <i class="material-icons">create</i> indica que la lección contiene actividades o tareas.'
		});
	}

	lessonHelp() {
		Swal.fire({
			title: 'Columna Lección',
			type: 'info',
			html: 'Como podrás imaginar, este es el título de la lección. <br>' +
			'También puedes presionar directamente el título de la unidad para comenzar la unidad.<br>' +
			'<span class="text-danger">No puedes ir directo a las lecciones de color negro.</span><br><span class="text-success">Pero sí puedes ir a las lecciones ya vistas en color verde.</span><br>Tienes que ir una por una.<br> Para iniciar el curso, presiona el botón <button type="button" class="btn btn-primary btn-sm">Iniciar curso</button>.'
		});
	}

	gradeHelp() {
		Swal.fire({
			title: 'Columna Calificación',
			type: 'info',
			html: 'Si la lección tiene un examen o tarea que deba calificarse aparecerá la calificación en esta columna.'
		});
	}

	print() {
		window.print();
	}

	goGrades() {

		this.router.navigate(['/user/progress', this.rosterType, this.id]);
	}

	getCert() {
		const cert = (this.rosterType == 'group') ? {
			id: this.content.groupid,
			status: this.content.myStatus,
			rosterType : this.rosterType
		} :
		{
			id: this.content.roster,
			status: this.content.myStatus,
			rosterType : this.rosterType
		}
		// console.group('content');
		// console.log(this.content);
		// console.groupEnd();
		// console.group('cert');
		// console.log(cert);
		// console.groupEnd();
		const id = (this.rosterType == 'group') ? this.content.groupid : this.content.roster;
		// console.group('id');
		// console.log(id)
		// console.groupEnd();
		localStorage.setItem('cert', JSON.stringify(cert)),
		// console.group('Mandando al CERT');
		// console.log('/cert');
		// console.log(cert.rosterType);
		// console.log(id);
		// console.groupEnd();
		this.router.navigate(['/cert', cert.rosterType, id]);
	}
}

function getUniques(oldArray:any) {
	// console.log(oldArray);
	var newArray = [];
	var sectionPaired = false;
	if(oldArray[0] && oldArray[0].section === 0) {
		sectionPaired = true;
	}
	var lastSection = -1;
	var i = 0;
	oldArray.forEach((item:any) => {
		if(item.section != lastSection) {
			if(lastSection > -1) {
				if(sectionPaired){
					newArray[lastSection].last = i;
				} else {
					newArray[lastSection - 1].last = i;
				}
			}
			lastSection = item.section;
			newArray.push({
				section: lastSection,
				link: '#link' + lastSection,
				name: 'link' + lastSection,
				number: i
			});
		}
		i++;
	});
	// console.log(lastSection);
	// console.log(newArray);
	if(sectionPaired){
		newArray[lastSection].last = oldArray.length;
	} else {
		newArray[lastSection - 1].last = oldArray.length;
	}
	//console.log(newArray);
	return newArray;
}
