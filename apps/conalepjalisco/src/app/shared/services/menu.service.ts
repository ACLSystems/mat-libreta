import { Injectable } from '@angular/core';
import { NotElemService, UserService, Roles } from '@mat-libreta/shared';

import {
	ROUTES_1,
	ROUTES_2,
	RouteInfo
} from '@cjashared/menus/routes';

@Injectable({
	providedIn: 'root'
})
export class MenuService {

	roles: Roles = {
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


	constructor(
		private notElementService: NotElemService,
		private userService: UserService
	) {}

	refreshMenu() {
		this.roles = this.userService.getRoles();
		if(!this.roles) {
			return [];
		}
		const myCurrentCourseData =
		JSON.parse(localStorage.getItem('currentCourse'));
		// console.group('myCurrentCourseData');
		// console.log(myCurrentCourseData);
		// console.groupEnd();
		const url = myCurrentCourseData ?  JSON.stringify([myCurrentCourseData.rosterType,myCurrentCourseData.id]) : null;
		var myCurrentCourse: RouteInfo;
		myCurrentCourse = {
			path: myCurrentCourseData ? '/user' : '',
			title:  myCurrentCourseData ? `Curso ${myCurrentCourseData.courseCode}` : '',
			type: myCurrentCourseData ? 'sub' : 'link',
			icontype: 'library_books',
			collapse: myCurrentCourseData ? 'user' : '',
			children: myCurrentCourseData ? [
				{
					path: 'content',
					subpath: url,
					title: 'Temario',
					ab: 'TM'
				},{
					path: 'progress',
					subpath: url,
					title: 'Mi progreso',
					ab: 'MP'
				},{
					path: 'support',
					title: 'Material de apoyo',
					subpath: url,
					ab: 'MA'
				},
				// {path: 'forum', title: 'Foro de discusión', ab: 'FD'},
				// {path: 'announcements', title: 'Avisos del curso', ab: 'AC'},
				// {path: 'events', title: 'Eventos del curso', ab: 'EC'}
			] : null
		}
		// console.group('myCurrentCourseData');
		// console.log(myCurrentCourse);
		// console.groupEnd();
		if(myCurrentCourseData && myCurrentCourseData.rosterType && myCurrentCourseData.rosterType === 'group') {
			myCurrentCourse.children.unshift({
				path: 'calendar',
				subpath: url,
				title: 'Calendario del curso',
				ab: 'CC'
			});
		}
		// return myCurrentCourseData ?
		// 	// [...ROUTES_1, myCurrentCourse, ...ROUTES_2] :
		// 	// [...ROUTES_1, ...ROUTES_2]
		// 	[...ROUTES_1, myCurrentCourse] :
		// 	[...ROUTES_1]

		if(myCurrentCourseData && !myCurrentCourseData.notification) {
			this.notElementService.showNotification(
				'bottom',
				'left',
				'success',
				`Seleccionaste (${myCurrentCourseData.courseCode}) - ${myCurrentCourseData.course} `
			);
			myCurrentCourseData.notification = true;
			localStorage.setItem('currentCourse',JSON.stringify(myCurrentCourseData));
		}


		const menuAll = ROUTES_2.filter(item => item.role === 'all');
		const menuReq = this.roles.isRequester ? ROUTES_2.filter(item => item.role === 'isRequester') : [];
		const menuSup = this.roles.isSupervisor ? ROUTES_2.filter(item => item.role === 'isSupervisor') : [];
		const moocSup = this.roles.isMoocSupervisor ? ROUTES_2.filter(item => item.role === 'isMoocSupervisor') : [];
		// console.log(this.roles);

		return myCurrentCourseData ? [
			...ROUTES_1,
			myCurrentCourse,
			...menuAll,
			...menuReq,
			...menuSup,
			...moocSup
		] : [
			...ROUTES_1,
			...menuAll,
			...menuReq,
			...menuSup,
			...moocSup
		];

		// console.log(regresa);
		// return regresa;
	}

}
