import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
//import * as Chartist from 'chartist';
import Swal from 'sweetalert2';
import * as Chartist from 'chartist';

import {
	UserService,
	UserCourseService,
	CurrentCourseService,
	CurrentCourse,
	CommonService,
	SuperService,
	Identity,
	Roles
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
	loading: boolean = false;
	messageNewUser = false;
	events: dashEvent[] = [];
	currentCourse: any = null;
	myRoles: Roles = {
		isAdmin: false,
		isBusines: false,
		isOrg: false,
		isOrgContent: false,
		isAuthor: false,
		isSupervisor: false,
		isInstructor: false,
		isRequester: false,
		isUser: false,
		isMoocSupervisor: false
	};
	totalCount: number;
	reportDate: Date;
	platform: string;
	backOffice: string;

	constructor(
		private router: Router,
		private userService: UserService,
		private userCourseService: UserCourseService,
		private currentCourseService: CurrentCourseService,
		private superService: SuperService,
		private commonService: CommonService
	) {
		this.identity = this.userService.getidentity();
		this.token = this.userService.getToken();
		this.platform = this.commonService.getEnvironment().platform;
		this.backOffice = this.commonService.getEnvironment().backOffice || null;
	}

	ngOnInit() {
		this.loading = true;
		this.identity = this.userService.getidentity();
		this.getMyRoles();
		this.getCourseUser();
		this.currentCourse = JSON.parse(localStorage.getItem('currentCourse'));
		// if(this.platform == 'mooc') {
		// 	this.getPublicData();
		// }
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

	getMyRoles() {
		this.myRoles = this.userService.getRoles();
		// if(!this.myRoles) {
		// 	this.userService.getRolesHTTP().subscribe(data => {
		//
		// 	},error => {
		// 		console.log(error);
		// 	});
		// }

	}

	// getPublicData() {
	// 	this.superService.getPublicData().subscribe(data => {
	// 		if(data) {
	// 			this.reportDate = data.firstDate;
	// 			if(data.totalCount) {
	// 				this.totalCount = data.totalCount;
	// 			}
	// 			const series = [...data.totalByCourse.series];
	// 			var max = 0;
	// 			series.forEach(s => {
	// 				max = (s > max) ? s : max;
	// 			});
	// 			if(data.totalByCourse) {
	// 				this.loadingPublicData = false;
	// 				setTimeout(() => {
	// 					const barOptions = {
	// 						// seriesBarDistance: 10,
	// 						// reverseData: true,
	// 						distributeSeries: true,
	// 						horizontalBars: true,
	// 						high: (max < 3) ? 3 : max,
	// 						axisX: {
	// 							offset: 50,
	// 							onlyInteger: true
	// 						},
	// 						axisY: {
	// 							offset: 100
	// 						}
	// 					};
	// 					const pieOptions = {
	// 						donut: false,
	// 						showLabel: true
	// 					};
	// 					const totalByCourseBarChart = new Chartist.Bar('#totalByCourseBarChart',{labels: data.totalByCourse.labels2, series},barOptions);
	// 					this.startAnimationForBarChart(totalByCourseBarChart);
	// 					// const totalByCoursePieChart = new Chartist.Pie('#totalByCoursePieChart',{series},pieOptions);
	// 				}, 300);
	// 			}
	// 		}
	//
	// 		// console.log(data);
	//
	// 	},
	// 	error => {
	// 		console.log(error);
	// 	})
	// }

	getCourseUser() {
		const minDays = 14;
		const today = new Date();
		this.loading = true;
		var diff = 0;
		this.userCourseService.getCourses().subscribe(data => {
			// console.group('data');
			// console.log(data);
			// console.groupEnd();
			if(data &&
				data.message &&
				data.message.groups &&
				Array.isArray(data.message.groups)
			) {
				const mycursos = data.message.groups;
				// console.group('mycursos');
				// console.log(mycursos);
				// console.groupEnd();
				// this.userCourseService.getCoursesOrg().subscribe(res => {
					// console.group('res');
					// console.log(res);
					// console.groupEnd();
					// for (const idcr of res.message.courses) {
						for (const idmg of mycursos) {
							// if (idcr.id === idmg.courseid ) {
								if (idmg.status === 'active') {
									let curso = {
										curso: idmg,
										imagen: idmg.courseImage
									};
									curso.curso.id = (curso.curso.rosterType && curso.curso.rosterType === 'public') ? curso.curso.rosterid : curso.curso.groupid;
									this.courseList.push(curso);
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
										imagen: idmg.courseImage
									});
								} else if (idmg.status === 'coming') {
									this.courseNext.push({
										curso: idmg,
										imagen: idmg.courseImage
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
							// }
						}
					// }
				// });
				// console.group('courseList');
				// console.log(this.courseList);
				// console.groupEnd();
				// console.group('inActiveCourses');
				// console.log(this.inActiveCourses);
				// console.groupEnd();
				this.messageNewUser = false;
				var courses = +localStorage.getItem('courses');
				courses ++;
				localStorage.setItem('courses',courses+'');
			} else if(data && data.message && data.message === 'No groups found'){
				this.messageNewUser = data.message;
				localStorage.setItem('courses','0');
			}
			this.loading = false;
			// console.log(this.courseList)
			// this.drawPieCourses();
		}, error => {
			console.log(error);
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

	startAnimationForBarChart(chart: any) {
		let seq2: number, delays2: number, durations2: number;
		seq2 = 0;
		delays2 = 80;
		durations2 = 500;
		chart.on('draw', function(data: any) {
			if (data.type === 'bar') {
				seq2++;
				data.element.animate({
					opacity: {
						begin: seq2 * delays2,
						dur: durations2,
						from: 0,
						to: 1,
						easing: 'ease'
					}
				});
			}
		});
		seq2 = 0;
	}

	/*
	Metodo para redireccionar al usuario al curso que seleccionó
	*/
	public getMyCourse(
		rosterType: string,
		course: string,
		courseCode: string,
		id: string,
		courseid: string,
		lastSeenBlock: string,
		firstBlock: string) {
		var currentCourse: CurrentCourse = {
			course: course,
			courseCode: courseCode,
			id: id,
			courseid: courseid,
			block: '',
			rosterType: rosterType
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
			'/user/content', rosterType, id
		]);
	}

	dateDiff(date1: Date, date2: Date) {
		var day = 1000 * 60 * 60 * 24;
		var date1_ms = date1.getTime();
		var date2_ms = date2. getTime();

		var diff_ms = date2_ms - date1_ms;

		return Math.round(diff_ms/day);
	}

	getCert(course:any) {
		const cert = (course.rosterType == 'group') ? {
			id: course.groupid,
			status: course.myStatus,
			rosterType : course.rosterType
		} :
		{
			id: course.rosterid,
			status: course.myStatus,
			rosterType : course.rosterType
		}
		// console.group('cert');
		// console.log(cert);
		// console.groupEnd();
		const id = (course.rosterType == 'group') ? course.groupid : course.rosterid;
		// console.group('id');
		// console.log(id)
		// console.groupEnd();
		localStorage.setItem('cert', JSON.stringify(cert)),
		this.router.navigate(['/cert',course.rosterType,id]);
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

	goToReports() {
		this.router.navigate(['/reports'])
	}

	goTutor() {
		const goTutor = `${this.backOffice}/tutor/tutorial`;
		console.log(goTutor);
		window.open(goTutor, '_blank');
	}

}
