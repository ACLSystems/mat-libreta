import { Injectable } from '@angular/core';
import { NotElemService } from '@mat-libreta/shared';

import {
	ROUTES_1,
	// ROUTES_2,
	RouteInfo
} from '@cjashared/menus/routes';

@Injectable({
	providedIn: 'root'
})
export class MenuService {

	constructor(
		private notElementService: NotElemService
	) {}

	refreshMenu() {
		const myCurrentCourseData =
		JSON.parse(localStorage.getItem('currentCourse'));
		// console.group('myCurrentCourseData');
		// console.log(myCurrentCourseData);
		// console.groupEnd();
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
					subpath: myCurrentCourseData.groupid,
					title: 'Temario',
					ab: 'TM'
				},{
					path: 'progress',
					subpath: myCurrentCourseData.groupid,
					title: 'Mi progreso',
					ab: 'MP'
				},{
					path: 'support',
					title: 'Material de apoyo',
					subpath: myCurrentCourseData.groupid,
					ab: 'MA'
				},
				{path: 'forum', title: 'Foro de discusión', ab: 'FD'},
				{path: 'announcements', title: 'Avisos del curso', ab: 'AC'},
				{path: 'events', title: 'Eventos del curso', ab: 'EC'}
			] : null
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


		return myCurrentCourseData ? [...ROUTES_1, myCurrentCourse] : [...ROUTES_1];
	}

}
