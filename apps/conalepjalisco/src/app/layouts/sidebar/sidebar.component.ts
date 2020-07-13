import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SimpleGlobal } from 'ng2-simple-global';
import PerfectScrollbar from 'perfect-scrollbar';

import {
	UserService,
	CurrentCourseService,
	NotElemService,
	Identity,
	Notification,
	CommonService
} from '@mat-libreta/shared';

import {
	RouteInfo
} from '@cjashared/menus/routes';

import {
	MenuService
} from '@cjashared/services/menu.service';

import {
	ShareService
} from '@cjashared/services/share.service';

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
	coursesNumber: number;
	instanceName 	: string;
	brand: string  = '/assets/img/';

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
		private router: Router,
		private commonService: CommonService,
		private sg: SimpleGlobal
	) {
		this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
			this.route = event.url;
		});
		const course = localStorage.getItem('currentCourse');
		this.coursesNumber = JSON.parse(localStorage.getItem('courses'));
		this.courseSelected = !!course;
		this.instanceName = this.sg['instance']?.instance?.name;
		this.brand += (document.location.hostname === 'localhost') ? 'conalepslp' : document.location.hostname.split('.')[0];
		this.brand += '_logo_blanco.png';
		// console.log('brand',this.brand);
	}

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('off-canvas-sidebar');
		this.menuItems = [...this.menuService.refreshMenu()];
		// console.group('Menu Items');
		// console.log(this.menuItems);
		// console.groupEnd();
		this.menuItems.forEach(mi => {
			if(mi.type == 'sub') {
				mi.children.forEach(child => {
					if(child.subpath) {
						const review = JSON.parse(child.subpath);
						if(Array.isArray(review)) {
							child.subpath = [...review];
						}
						let link = [...child.subpath];
						link.unshift(mi.path,child.path);
						child.link = [...link];
					}
				});
			}
		});
		if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
				const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
				this.ps = new PerfectScrollbar(elemSidebar);
		}
		this.subscription = this.currentCourseService.getCurrentCourse.subscribe(() => {
				this.menuItems = [...this.menuService.refreshMenu()];
				this.menuItems.forEach(mi => {
					if(mi.type == 'sub') {
						mi.children.forEach(child => {
							const review = JSON.parse(child.subpath);
							if(Array.isArray(review)) {
								child.subpath = [...review];
							}
						});
					}
				});
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
		if(this.commonService.getEnvironment()) {
			this.getUserImage();
		} else {
			this.commonService.getCurrentEnvironment.subscribe(() => {
				this.getUserImage();
			});
		}

		if(!this.courseSelected && this.coursesNumber > 0) {
			this.notElementService.showNotification(
				'bottom',
				'left',
				'warning',
				'<i class="fas fa-book-open text-white"></i> Selecciona tu curso en el panel'
			);
		}
		if(!this.coursesNumber || this.coursesNumber === 0) {
			this.notElementService.showNotification(
				'top',
				'left',
				'info',
				'<div class="text-center"><i class="fas fa-book-open text-white"></i> Busca algún curso de tu interés en el catálogo de cursos.<br><b>Da click aquí<br><b></div>',
				'/#/pages/catalog',
				'_self'
			);
		}
	}

	getUserImage() {
		this.image = this.userService.getUserImage().subscribe(data => {
			if(data) {
				this.createImageFromBlob(data);
			}
		}, err => {
			console.log(err);
		});
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

	goCatalog() {
		this.router.navigate(['/pages/catalog']);
	}
}
