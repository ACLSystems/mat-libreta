import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
//import * as Chartist from 'chartist';
import Swal from 'sweetalert2';

import {
	UserService,
	UserCourseService,
	CurrentCourseService,
	CurrentCourse,
	Identity
} from '@mat-libreta/shared';


registerLocaleData(localeMX);

interface dashEvent {
	title: string,
	start: Date,
	end: Date
}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	providers: [
		UserService,
		UserCourseService,
		{ provide: LOCALE_ID, useValue: 'es-MX'}
	]
})
export class DashboardComponent implements OnInit {

	identity: Identity;
	token: any;
	courseList: any[] = [];
	inActiveCourses: any[] = [];
	courseNext: any[] = [];
	loading = false;
	messageNewUser = false;
	events: dashEvent[] = [];
	currentCourse: any = null;

	constructor(
		private router: Router,
		private userService: UserService,
		private userCourseService: UserCourseService,
		private currentCourseService: CurrentCourseService
	) {
		this.identity = this.userService.getidentity();
		this.token = this.userService.getToken();
	}

	ngOnInit() {
		this.loading = true;
		this.identity = this.userService.getidentity();
		this.getCourseUser();
		this.currentCourse = JSON.parse(localStorage.getItem('currentCourse'));
	}
	//
	// Para prevenir copia y descarga
	//
	// @HostListener('copy', ['$event'])
	// blockCopy(e: KeyboardEvent) {
	// 	e.preventDefault();
	// 	console.log('No puedes copiar!')
	// }
	//
	// @HostListener('cut', ['$event'])
	// blockCut(e: KeyboardEvent) {
	// 	e.preventDefault();
	// 	console.log('No puedes cortar!')
	// }
	//
	// @HostListener('paste', ['$event'])
	// blockPaste(e: KeyboardEvent) {
	// 	e.preventDefault();
	// 	console.log('No puedes pegar!')
	// }
	//
	// @HostListener('select', ['$event'])
	// blockSelect(e: MouseEvent){
	// 	e.preventDefault();
	// 	console.log('No puedes seleccionar nada!!!')
	// }
	//
	// @HostListener('contextMenu', ['$event'])
	// blockContextMenu(e: MouseEvent){
	// 	e.preventDefault();
	// 	console.log('No puedes usar el botón secundario!!!')
	// }

	async getCourseUser() {
		const minDays = 14;
		const today = new Date();
		this.loading = true;
		var diff = 0;
		await this.userCourseService.getCourses().subscribe(data => {
			const mycursos = data.message.groups;
			// console.group('mycursos')
			// console.log(mycursos)
			// console.groupEnd()
			this.userCourseService.getCoursesOrg().subscribe(res => {
				for (const idcr of res.message.courses) {
					for (const idmg of mycursos) {
						if (idcr.id === idmg.courseid ) {
							if (idmg.status === 'active') {
								this.courseList.push({
									curso: idmg,
									imagen: idcr.image
								});
								diff = this.dateDiff(new Date(idmg.beginDate),today);
								if(diff >= 0 && diff <= minDays){
									this.events.push({
										title: `Inicio del curso ${idmg.course }`,
										start: idmg.beginDate,
										end: idmg.endDate
									});
								}
							} else if (idmg.status === 'closed') {
								this.inActiveCourses.push({
									curso: idmg,
									imagen: idcr.image
								});
							} else if (idmg.status === 'coming') {
								this.courseNext.push({
									curso: idmg,
									imagen: idcr.image
								});
								diff = this.dateDiff(new Date(idmg.beginDate),today);
								if(diff >= 0 && diff <= minDays){
									this.events.push({
										title: `Inicio del Curso ${idmg.course }`,
										start: idmg.beginDate,
										end: idmg.endDate
									});
								}
							}
						}
					}
				}
			});
			this.messageNewUser = false;
			this.loading = false;
			// console.log(this.courseList)
			// this.drawPieCourses();
		}, error => {
			if(error.error && error.error.errMessage && error.error.errMessage ==="invalid signature") {
				Swal.fire({
					title: 'Necesitas ingresar al sistema nuevamente',
					html: error.error.message,
					type: 'error',
					confirmButtonText: 'Ok',
					confirmButtonClass: 'btn btn-danger'
				});
				this.router.navigate(['/pages/login']);
			} else if (error._body.includes('"message":"No groups found"')) {
				this.messageNewUser = error._body.includes('"message":"No groups found"');
			}
			this.loading = false;
		});
	}

	/*
	Metodo para redireccionar al usuario al curso que seleccionó
	*/
	public getMyCourse(course: string, courseCode: string, groupid: string, courseid: string, lastSeenBlock: string, firstBlock: string) {
		var currentCourse: CurrentCourse = {
			course: course,
			courseCode: courseCode,
			groupid: groupid,
			courseid: courseid,
			block: ''
		}
		currentCourse.block = lastSeenBlock ? lastSeenBlock : firstBlock;
		localStorage.setItem('currentCourse', JSON.stringify(currentCourse));
		this.currentCourseService.sendCurrentCourse(currentCourse);
		// let navigate = [
		// 	'/user/course',
		// 	course,
		// 	groupid,
		// 	courseid,
		// 	currentCourse.block
		// ]
		// console.log(navigate)
		// this.router.navigate(navigate);
		this.currentCourse = currentCourse;
		this.router.navigate([
			'/user/content', groupid
		]);

	}

	dateDiff(date1: Date, date2: Date) {
		var day = 1000 * 60 * 60 * 24;
		var date1_ms = date1.getTime();
		var date2_ms = date2. getTime();

		var diff_ms = date2_ms - date1_ms;

		return Math.round(diff_ms/day);
	}

	// drawPieCourses() {
	// 	const courses: number[] = [
	// 		+this.courseList.length,
	// 		+this.courseNext.length,
	// 		+this.inActiveCourses.length
	// 	];
	// 	console.log(this.courseList);
	// 	console.log(this.courseList.length);
	// 	console.log(courses)
	// 	const perList: string = courses.reduce((perList,x) => perList + x) + '%';
	// 	const perNext: string = courses.reduce((perNext,x) => perNext + x) + '%';
	// 	const perInActive: string = courses.reduce((perInActive,x) => perInActive + x) + '%';
	//
	// 	const dataPreferences = {
	// 		labels: [perList, perNext, perInActive],
	// 		series: courses
	// 	}
	// 	const optionsPreferences = {
	// 		height: '230px'
	// 	}
	// 	new Chartist.Pie('#pieMyCourses', dataPreferences, optionsPreferences);
	// }

}
