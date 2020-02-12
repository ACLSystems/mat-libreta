import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

import {
	UserService,
	CurrentCourseService,
	NotElemService,
	Identity,
	Notification
} from '@mat-libreta/shared';

import {
	RouteInfo
} from '@cetecshared/menus/routes';

import {
	MenuService
} from '@cetecshared/services/menu.service';

import {
	ShareService
} from '@cetecshared/services/share.service';

declare const $: any;

@Component({
	selector: 'app-sidebar-cmp',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	providers: [
		MenuService,
		NotElemService
	]
})
export class SidebarComponent implements OnInit, OnDestroy {

	subscription: Subscription;
	subsNotData: Subscription;
	identity: Identity;
	image: any;
	route: string;
	ROUTES: RouteInfo[];
	courseSelected: boolean;
	notificationNumber: number;
	notifications:  Notification[];

	public menuItems: any[];
	ps: any;
	isMobileMenu() {
			if ($(window).width() > 991) {
					return false;
			}
			return true;
	};

	constructor(
		private menuService: MenuService,
		private currentCourseService: CurrentCourseService,
		private userService: UserService,
		private notElementService: NotElemService,
		private shareService: ShareService,
		private router: Router
	) {
		this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
			this.route = event.url;
		});
		const course = localStorage.getItem('currentCourse');
		this.courseSelected = !!course;
	}

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('off-canvas-sidebar');
		this.menuItems = [...this.menuService.refreshMenu()];
		// console.group('Menu Items');
		// console.log(this.menuItems);
		// console.groupEnd();
		if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
				const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
				this.ps = new PerfectScrollbar(elemSidebar);
		}
		this.subscription = this.currentCourseService.getCurrentCourse.subscribe(() => {
				this.menuItems = [...this.menuService.refreshMenu()];
			}
		);
		this.subsNotData = this.shareService.getNotifData.subscribe((data: Notification[]) => {
				// console.group('Datos')
				// console.log(data)
				// console.groupEnd()
				this.notificationNumber = data.length;
				this.notifications = [...data];
			}
		);
		this.identity = this.userService.getidentity();
		this.image = this.userService.getUserImage().subscribe(data => {
			this.createImageFromBlob(data);
		}, err => {
			console.log(err);
		});
		if(!this.courseSelected) {
			this.notElementService.showNotification(
				'bottom',
				'left',
				'warning',
				'<i class="fas fa-book-open text-white"></i> Selecciona tu curso en el panel'
			);
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.subsNotData.unsubscribe();
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
