import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import Swal from 'sweetalert2';

import {
	UserService,
	UserCourseService,
	WindowService,
	CommService,
	CommonService,
	Section
} from '@mat-libreta/shared';
import { DocsService } from './docs.service';

registerLocaleData(localeMX);

@Component({
	selector: 'app-course-main',
	templateUrl: './courseMain.component.html',
	styleUrls: ['./courseMain.component.scss'],
	providers: [
		UserService,
		UserCourseService,
		DocsService,
		WindowService,
		CommService,
		{ provide: LOCALE_ID, useValue: 'es-MX'}
	]
})
export class CourseMainComponent implements OnInit {

	loading: boolean = true;
	groupid: string;
	group: any;
	sections: Section[] = [];
	courseStarted: boolean = false;
	track: number = 0;
	finalGrade: number;
	bank: string;
	bankAccount: string;
	bankCLABE: string;
	mocAmount: string;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userCourseService: UserCourseService,
		private commService: CommService,
		private commonService: CommonService
	) {
		this.loading = true;
		this.activatedRoute.params.subscribe(params => {
				this.groupid = params.groupid;
			}
		)
		this.bank = this.commonService.getEnvironment().bank;
		this.bankAccount = this.commonService.getEnvironment().bankAccount;
		this.bankCLABE = this.commonService.getEnvironment().bankCLABE;
		this.mocAmount = this.commonService.getEnvironment().mocAmount;
	}

	ngOnInit() {
		this.loading = true;
		this.getGroup();
		this.commService.sendMessage('hola');
		this.commService.getMessage().subscribe(data => {
			console.log(data);
			this.commService.sendMessage('Cómo estás?');
		});
	}

	getGroup() {
		this.userCourseService.myGroup(this.groupid).subscribe(data => {
			const notFoundMessage = `Group with id -${this.groupid}- not found`;
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
				this.group = data.message;
				// console.log(this.group);
				this.sections = getUniques(this.group.blocks);
				// console.log(this.sections);
				this.track = parseInt(this.group.track.split('%')[0]);
				//console.log(this.track);
				this.finalGrade = this.group.finalGrade ? this.group.finalGrade : 0;
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

	getBlock(blockid: string, force?: boolean) {
		const courseid = this.group.courseid;
		const groupid = this.groupid;
		if(this.track || force) {
			this.router.navigate(['/user/block', courseid, groupid, blockid]);
		}
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
		this.router.navigate(['/user/progress', this.group.groupid]);
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
