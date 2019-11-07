import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

import { CurrentCourse } from '@cjashared/types/course.type';
import { Identity } from '@cjashared/types/user.type';

import { CurrentCourseService } from '@cjashared/services/currentcourse.service';
import { UserService } from '@cjashared/services/user.service';

declare const $: any;

//Metadata
export interface RouteInfo {
		path: string;
		title: string;
		type: string;
		icontype: string;
		collapse?: string;
		children?: ChildrenItems[];
}

export interface ChildrenItems {
		path: string;
		subpath?: string;
		title: string;
		ab: string;
		type?: string;
}



//Menu Items
const ROUTES_1: RouteInfo[] = [{
				path: '/dashboard',
				title: 'Panel',
				type: 'link',
				icontype: 'dashboard'
		},{
				path: '/calendar',
				title: 'Calendario',
				type: 'link',
				icontype: 'date_range'
		}
];

const myCurrentCourseData = JSON.parse(localStorage.getItem('currentCourse'));

export const myCurrentCourse: RouteInfo = {
	path: myCurrentCourseData ? '/user' : '',
	title: myCurrentCourseData ? `Curso ${myCurrentCourseData.courseCode}` : '',
	type: myCurrentCourseData ? 'sub' : 'link',
	icontype: 'library_books',
	collapse: myCurrentCourseData ? 'user' : '',
	children: myCurrentCourseData ? [
		{path: 'content', title: 'Temario', ab: 'TM'},
		{path: 'progress', title: 'Mi progreso', ab: 'MP'},
		{path: 'support', title: 'Material de apoyo', ab: 'MA'},
		{path: 'forum', title: 'Foro de discusión', ab: 'FD'},
		{path: 'announcements', title: 'Avisos del curso', ab: 'AC'},
		{path: 'events', title: 'Eventos del curso', ab: 'EC'}
	] : null
}
		// {
		// 		path: '/user/course',
		// 		title: 'Curso Actual',
		// 		type: 'link',
		// 		icontype: 'library_books'
		// },

const ROUTES_2: RouteInfo[] = [{
				path: '/editor',
				title: 'Editor',
				type: 'link',
				icontype: 'content_paste'
		},{
				path: '/admin',
				title: 'Administrador',
				type: 'link',
				icontype: 'settings_applications'
		},{
				path: '/charts',
				title: 'Reportes',
				type: 'link',
				icontype: 'timeline'
		}
];

export const ROUTES: RouteInfo [] = myCurrentCourseData ?
	// [...ROUTES_1, myCurrentCourse, ...ROUTES_2] :
	// [...ROUTES_1, ...ROUTES_2]
	[...ROUTES_1, myCurrentCourse] :
	[...ROUTES_1]


@Component({
	selector: 'app-sidebar-cmp',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	providers: [
		CurrentCourseService
	]
})
export class SidebarComponent implements OnInit, OnDestroy {

	subscription: Subscription;
	identity: Identity;
	image: any;
	route: string;

	public menuItems: any[];
	ps: any;
	isMobileMenu() {
			if ($(window).width() > 991) {
					return false;
			}
			return true;
	};

	constructor(
		private currentCourseService: CurrentCourseService,
		private userService: UserService,
		private router: Router
	) {
		this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
			this.route = event.url;
		});
	}

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('off-canvas-sidebar');
		this.menuItems = ROUTES.filter(menuItem => menuItem);
		if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
				const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
				this.ps = new PerfectScrollbar(elemSidebar);
		}
		this.refreshCourseData(null);
		this.subscription = this.currentCourseService.getCurrentCourse.subscribe((data: CurrentCourse) => {
				this.refreshCourseData(data);
			}
		);
		this.identity = this.userService.getidentity();
		this.image = this.userService.getUserImage().subscribe(data => {
			this.createImageFromBlob(data);
		}, err => {
			console.log(err);
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	updatePS(): void  {
			if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
					this.ps.update();
			}
	}
	isMac(): boolean {
			let bool = false;
			if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
					bool = true;
			}
			return bool;
	}

	refreshCourseData(data:CurrentCourse) {
		if(!data) {
			data = JSON.parse(localStorage.getItem('currentCourse'));
		}
		if(data) {
			const myCurrentCourseData = data;
			// let contentPath = `content/${myCurrentCourseData.groupid}`;
			// console.log(contentPath);
			const myCurrentCourse: RouteInfo = {
				path: myCurrentCourseData ? '/user' : '',
				title: myCurrentCourseData ? `Curso ${myCurrentCourseData.courseCode}` : '',
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
			var foundIndex = this.menuItems.findIndex(item => item.path == myCurrentCourse.path);
			if(foundIndex > 0) {
				this.menuItems[foundIndex] = myCurrentCourse;
			}
		}
	}

	createImageFromBlob(image: Blob) {
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			this.image = reader.result;
		}, false);
		if (image) {
			reader.readAsDataURL(image);
		}
	}

	goValidate() {
		this.router.navigate(['/user/profile']);
	}
}
