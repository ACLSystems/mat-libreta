import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

import { TourService } from 'ngx-tour-ng-bootstrap';

import { NavItem, NavItemType} from '@cetecmd/md.module';
import { NavbarComponent } from '@cetecnavbar/navbar.component';

import { TOURSTEPS } from '@cetecshared/tour/tourSteps';

declare const $: any;

@Component({
	selector: 'app-layout',
	templateUrl: './logged.component.html',
	styleUrls: ['./logged.component.scss']
})
export class LoggedComponent implements OnInit, AfterViewInit {

	public navItems: NavItem[];
	private _router: Subscription;
	private lastPoppedUrl: string;
	private yScrollStack: number[] = [];
	url: string;
	location: Location;

	@ViewChild('sidebar') sidebar: any;
	@ViewChild(NavbarComponent) navbar: NavbarComponent;

	constructor(
		private router: Router,
		location: Location,
		private tourService: TourService
	) {
		this.location = location;
	}

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('off-canvas-sidebar');
		const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
		const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
		this.location.subscribe((ev:PopStateEvent) => {
				this.lastPoppedUrl = ev.url;
		});
		this.router.events.subscribe((event:any) => {
			if (event instanceof NavigationStart) {
				 if (event.url != this.lastPoppedUrl)
						 this.yScrollStack.push(window.scrollY);
		 } else if (event instanceof NavigationEnd) {
				 if (event.url == this.lastPoppedUrl) {
						 this.lastPoppedUrl = undefined;
						 window.scrollTo(0, this.yScrollStack.pop());
				 }
				 else
						 window.scrollTo(0, 0);
		 }
		});
		this._router = this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
			 elemMainPanel.scrollTop = 0;
			 elemSidebar.scrollTop = 0;
		});
		const html = document.getElementsByTagName('html')[0];
		if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
				let ps = new PerfectScrollbar(elemMainPanel);
				ps = new PerfectScrollbar(elemSidebar);
				html.classList.add('perfect-scrollbar-on');
		}
		else {
				html.classList.add('perfect-scrollbar-off');
		}
		this._router = this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
				.subscribe((event: NavigationEnd) => {
			this.navbar.sidebarClose();
		});

		// this.navItems = [
		// 	{ type: NavItemType.NavbarLeft, title: 'Dashboard', iconClass: 'fa fa-dashboard' },
		//
		// 	{
		// 		type: NavItemType.NavbarRight,
		// 		title: '',
		// 		iconClass: 'fa fa-bell-o',
		// 		numNotifications: 5,
		// 		dropdownItems: [
		// 			{ title: 'Notification 1' },
		// 			{ title: 'Notification 2' },
		// 			{ title: 'Notification 3' },
		// 			{ title: 'Notification 4' },
		// 			{ title: 'Another Notification' }
		// 		]
		// 	},
		// 	{
		// 		type: NavItemType.NavbarRight,
		// 		title: '',
		// 		iconClass: 'fa fa-list',
		//
		// 		dropdownItems: [
		// 			{ iconClass: 'pe-7s-mail', title: 'Messages' },
		// 			{ iconClass: 'pe-7s-help1', title: 'Help Center' },
		// 			{ iconClass: 'pe-7s-tools', title: 'Settings' },
		// 			 'separator',
		// 			{ iconClass: 'pe-7s-lock', title: 'Lock Screen' },
		// 			{ iconClass: 'pe-7s-close-circle', title: 'Log Out' }
		// 		]
		// 	},
		// 	{ type: NavItemType.NavbarLeft, title: 'Search', iconClass: 'fa fa-search' },
		//
		// 	{ type: NavItemType.NavbarLeft, title: 'Account' },
		// 	{
		// 		type: NavItemType.NavbarLeft,
		// 		title: 'Dropdown',
		// 		dropdownItems: [
		// 			{ title: 'Action' },
		// 			{ title: 'Another action' },
		// 			{ title: 'Something' },
		// 			{ title: 'Another action' },
		// 			{ title: 'Something' },
		// 			'separator',
		// 			{ title: 'Separated link' },
		// 		]
		// 	},
		// 	{ type: NavItemType.NavbarLeft, title: 'Log out' }
		// ];
		this.tourService.initialize([
			{
				anchorId: 'iniciar.tour',
				content: '<p class="text-justify">Bienvenido a CETEC - Supérate México.</p><p class="text-justify">Este tour te permitirá conocer la plataforma de un vistazo.</p><p>Si presionas el logo de cetec (arriba a la izquierda) siempre regresarás a esta página.</p><p class="text-justify">Presiona la flecha azul para continuar el tour o el botón <span class="text-danger">Finalizar Tour</span> para terminar este tutorial en cualquier momento.</p>',
				placement: 'bottom',
				title: 'Bienvenido'
			},{
				anchorId: 'name.tour',
				content: '<p class="text-justify">Aquí puedes validar tus datos.</p><p class="text-justify">En esta parte observarás tu(s) nombre(s) y apellido paterno. No lo hagas ahora, pero si presionas sobre tu nombre, podrás acceder a <b>Mi perfil</b> y ahí podrás ver tu nombre completo.</p><p class="text-justify">No puedes modificar tus datos, pero si llegaras a ver algún error en tu nombre manda un correo a <a href="mailto://support@cetec.freshdesk.com">support@cetec.freshdesk.com</a> para corregirlo</p>',
				placement: 'bottom',
				title: 'Tus datos'
			},{
				anchorId: 'panel.tour',
				content: '<p class="text-justify">En el panel puedes encontrar y seleccionar los cursos:</p><ul><li>Activos</li><li>Próximos cursos</li><li>Cursos finalizados</li></ul>',
				placement: 'bottom',
				title: 'Panel'
			},{
				anchorId: 'calendar.tour',
				content: '<p class="text-justify">El calendario te da una vista general de los eventos que generan tus cursos, como el comienzo y final de cada curso</p>',
				placement: 'bottom',
				title: 'Calendario'
			},{
				anchorId: 'events.tour',
				content: '<p class="text-justify">Aquí encontrarás eventos relevantes con respecto a tus cursos</p>',
				placement: 'bottom',
				title: 'Eventos'
			},{
				anchorId: 'cactivos.tour',
				content: '<p class="text-justify">Los cursos están activos porque ya los puedes comenzar o porque ya los estás cursando.</p><p  class="text-justify">Ahora, en lugar de presionar la flecha azul, presiona donde dice "<b>Cursos Activos</b>" para continuar</p><p>Hazlo ahora</p>',
				placement: 'bottom',
				title: 'Cursos Activos'
			},{
				stepId: 'course.tour',
				anchorId: 'course.tour',
				content: '<p class="text-justify">Este es tu curso. Si tienes más cursos inscritos los podrás ver cada uno en forma de tarjeta</p><p>Presiona el nombre de tu curso (en letras azules) o la imagen para ingresar a tu curso</p>',
				placement: 'right',
				title: 'Tu curso'
			},{
				stepId: 'incourse.tour',
				anchorId: 'incourse.tour',
				content: '<p class="text-justify">Este el el nombre de tu curso</p>',
				placement: 'bottom',
				title: 'Tu curso'
			}
		],{
			route: '',
			placement: 'right',
			preventScrolling: false,
			prevBtnTitle: 'Anterior',
			nextBtnTitle: 'Siguiente',
			endBtnTitle: 'Finalizar Tour'
		});
		// this.tourService.events$.subscribe(x => {
		// 	console.log(x);
		// });
		const tourBegin = localStorage.getItem('tour');
		if(tourBegin !== 'finish') {
			console.log('iniciando tour')
			setTimeout(() => {
				this.tourService.start();
			},900);
		}
	}
	ngAfterViewInit() {
		this.runOnRouteChange();
	}
	public isMap() {
		if (this.location.prepareExternalUrl(this.location.path()) === '/maps/fullscreen') {
				return true;
		} else {
				return false;
		}
	}
	runOnRouteChange(): void {
		if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
			const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
			const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
			let ps = new PerfectScrollbar(elemMainPanel);
			ps = new PerfectScrollbar(elemSidebar);
			ps.update();
		}
	}
	isMac(): boolean {
		let bool = false;
		if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
				bool = true;
		}
		return bool;
	}

	setTour(step: any) {
		console.log(step)
		localStorage.setItem('tour',JSON.stringify(step));
		// if(step.anchorId === 'panel.tour') {
		// 	$('#collapseActive').collapse('show');
		// }
	}
	finishTour(step: any) {
		console.log(step)
		localStorage.setItem('tour','finish');
	}

}
