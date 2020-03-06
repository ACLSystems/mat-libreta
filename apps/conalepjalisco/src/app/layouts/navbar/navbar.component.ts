import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';

// import { ROUTES } from '@cjasidebar/sidebar.component';
import { UserService, CommonService, CommService, Bell, Notification, Command, NotElemService } from '@mat-libreta/shared';

import { MenuService } from '@cjashared/services/menu.service';

import { ShareService } from '@cjashared/services/share.service';

const misc: any = {
		navbar_menu_visible: 0,
		active_collapse: true,
		disabled_collapse_init: 0,
};

declare var $: any;

@Component({
	selector: 'app-navbar-cmp',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
	providers: [
		MenuService,
		CommService,
		NotElemService
	]
})
export class NavbarComponent implements OnInit {

	private listTitles: any[];
	location: Location;
	mobile_menu_visible: any = 0;
	private nativeElement: Node;
	private toggleButton: any;
	private sidebarVisible: boolean;
	private _router: Subscription;
	private userid: string;
	notificationNumber: number = 0;
	notifications:  Notification[];

	@ViewChild('app-navbar-cmp') button: any;

	constructor(
		location: Location,
		private renderer: Renderer2,
		private element: ElementRef,
		private router: Router,
		private commonService: CommonService,
		private userService: UserService,
		private commService: CommService,
		private menuService: MenuService,
		private shareService: ShareService,
		private notElementService: NotElemService
	) {
		this.location = location;
		this.nativeElement = element.nativeElement;
		this.sidebarVisible = false;
		this.userid = this.commonService.getidentity().userid;
	}

	minimizeSidebar(){
		const body = document.getElementsByTagName('body')[0];

		if (misc.sidebar_mini_active === true) {
			body.classList.remove('sidebar-mini');
			misc.sidebar_mini_active = false;

		} else {
			setTimeout(function() {
				body.classList.add('sidebar-mini');
				misc.sidebar_mini_active = true;
			}, 300);
		}

		// we simulate the window Resize so the charts will get updated in realtime.
		const simulateWindowResize = setInterval(function() {
			window.dispatchEvent(new Event('resize'));
		}, 180);

		// we stop the simulation of Window Resize after the animations are completed
		setTimeout(function() {
			clearInterval(simulateWindowResize);
		}, 1000);
	}
	hideSidebar(){
		const body = document.getElementsByTagName('body')[0];
		const sidebar = document.getElementsByClassName('sidebar')[0];

		if (misc.hide_sidebar_active === true) {
			setTimeout(function() {
				body.classList.remove('hide-sidebar');
				misc.hide_sidebar_active = false;
			}, 300);
			setTimeout(function () {
				sidebar.classList.remove('animation');
			}, 600);
			sidebar.classList.add('animation');

		} else {
			setTimeout(function() {
				body.classList.add('hide-sidebar');
				// $('.sidebar').addClass('animation');
				misc.hide_sidebar_active = true;
			}, 300);
		}

		// we simulate the window Resize so the charts will get updated in realtime.
		const simulateWindowResize = setInterval(function() {
			window.dispatchEvent(new Event('resize'));
		}, 180);

		// we stop the simulation of Window Resize after the animations are completed
		setTimeout(function() {
			clearInterval(simulateWindowResize);
		}, 1000);
	}

	ngOnInit() {
		// this.listTitles = ROUTES.filter(listTitle => listTitle);
		this.listTitles = [...this.menuService.refreshMenu()];
		const navbar: HTMLElement = this.element.nativeElement;
		const body = document.getElementsByTagName('body')[0];
		this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
		if (body.classList.contains('sidebar-mini')) {
				misc.sidebar_mini_active = true;
		}
		if (body.classList.contains('hide-sidebar')) {
				misc.hide_sidebar_active = true;
		}
		this._router = this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
			this.sidebarClose();

			const $layer = document.getElementsByClassName('close-layer')[0];
			if ($layer) {
				$layer.remove();
			}
		});
		this.commService.getMessage(this.userid).subscribe((data:any) => {
			// console.log(data);
			// Falta agregar la funcionalidad de refrescar las notificaciones.
			if(data && data.command) {
				if(data.command === 'reload') {
					location.reload(true);
				} else if(data.command === 'notification') {
					this.bell();
					this.notElementService.showNotification(
						'top',
						'right',
						'danger',
						'<i class="far fa-bell text-white"></i> Tienes un nuevo mensaje'
					);
				}
			}

		});
		setTimeout(() => {
			this.commService.sendMessage('init',this.userid);
		}, 801);
		this.bell();
	}

	onResize(event) {
		if ($(window).width() > 991) {
			return false;
		}
		return true;
	}
	sidebarOpen() {
		var $toggle = document.getElementsByClassName('navbar-toggler')[0];
			const toggleButton = this.toggleButton;
			const body = document.getElementsByTagName('body')[0];
			setTimeout(function(){
					toggleButton.classList.add('toggled');
			}, 500);
			body.classList.add('nav-open');
			setTimeout(function() {
					$toggle.classList.add('toggled');
			}, 430);

			var $layer = document.createElement('div');
			$layer.setAttribute('class', 'close-layer');


			if (body.querySelectorAll('.main-panel')) {
					document.getElementsByClassName('main-panel')[0].appendChild($layer);
			}else if (body.classList.contains('off-canvas-sidebar')) {
					document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
			}

			setTimeout(function() {
					$layer.classList.add('visible');
			}, 100);

			$layer.onclick = function() { //asign a function
				body.classList.remove('nav-open');
				this.mobile_menu_visible = 0;
				this.sidebarVisible = false;

				$layer.classList.remove('visible');
				setTimeout(function() {
						$layer.remove();
						$toggle.classList.remove('toggled');
				}, 400);
			}.bind(this);

			body.classList.add('nav-open');
			this.mobile_menu_visible = 1;
			this.sidebarVisible = true;
	};
	sidebarClose() {
		var $toggle = document.getElementsByClassName('navbar-toggler')[0];
			const body = document.getElementsByTagName('body')[0];
			this.toggleButton.classList.remove('toggled');
			var $layer = document.createElement('div');
			$layer.setAttribute('class', 'close-layer');

			this.sidebarVisible = false;
			body.classList.remove('nav-open');
			// $('html').removeClass('nav-open');
			body.classList.remove('nav-open');
			if ($layer) {
					$layer.remove();
			}

			setTimeout(function() {
					$toggle.classList.remove('toggled');
			}, 400);

			this.mobile_menu_visible = 0;
	};
	sidebarToggle() {
			if (this.sidebarVisible === false) {
					this.sidebarOpen();
			} else {
					this.sidebarClose();
			}
	}

	getTitle() {
		var titlee = this.location.prepareExternalUrl(this.location.path());
		if(titlee.charAt(0) === '#'){
				titlee = titlee.slice( 1 );
		}
		for (let i = 0; i < this.listTitles.length; i++) {
			if (this.listTitles[i].type === "link" && this.listTitles[i].path === titlee) {
				return this.listTitles[i].title;
			} else if (this.listTitles[i].type === "sub") {
				for (let j = 0; j < this.listTitles[i].children.length; j++) {
					let subtitle = this.listTitles[i].path + '/' + this.listTitles[i].children[j].path;
					//console.log(subtitle)
					// console.log(titlee)
					const currentCourse = JSON.parse(localStorage.getItem('currentCourse'));
					if (subtitle === titlee) {
						return this.listTitles[i].children[j].title;
					} else if (titlee.includes(subtitle)){
						if(currentCourse) {
							return currentCourse.course
						} else {
							return 'Panel'
						}
					} else if(titlee.includes('/user/progress')) {
						return 'Progreso del curso ' + currentCourse.course
					} else if(titlee.includes('/user/block')) {
						return currentCourse.course
					} else if(titlee.includes('/user/support')) {
						return currentCourse.course
					} else if(titlee.includes('/user/profile')) {
						let user = this.userService.getidentity();
						return `${user.person.name} ${user.person.fatherName} ${user.person.motherName}`
					} else {
						return 'Panel'
					}
				}
			}
		}
		return 'Panel';
	}
	getPath() {
		const currentCourse = JSON.parse(localStorage.getItem('currentCourse'));
		if(currentCourse && this.location.path().includes('/user/block')) {
			return this.location.prepareExternalUrl(`/user/content/${currentCourse.groupid}`);
		} else {
		return this.location.prepareExternalUrl(this.location.path());
		}
	}
	bell() {
		this.userService.bell().subscribe((data:Bell) => {
			// console.group('Bell');
			// console.log(data);
			// console.groupEnd();
			this.notificationNumber = data.newNotifications;
			this.myNotifications();
		});
	}

	myNotifications() {
		this.userService.getMyNotifications().subscribe(data => {
			if(data.message && Array.isArray(data.message) && data.message.length > 0) {
				this.notifications = [...data.message];
				// console.group('Noti');
				// console.log(this.notifications);
				// console.groupEnd();
				this.shareService.sendEvent(this.notifications);
			}
		});
	}

	runCommand(object:Command) {
		switch (object.command) {
			case 'message':

				break;
			case 'notification':
				if(object.message === 'reload') {

				}
				break;
		}
	}

}
