import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

import { Identity } from '@crmshared/types/user.type';

import { UserService } from '@crmshared/services/user.service';

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
export const ROUTES: RouteInfo[] = [{
				path: '/dashboard',
				title: 'Panel',
				type: 'link',
				icontype: 'dashboard'
		},{
				path: '/calendar',
				title: 'Calendario',
				type: 'link',
				icontype: 'date_range'
		},{
				path: '/users',
				title: 'Usuarios',
				type: 'sub',
				icontype: 'people',
				collapse: 'usuarios',
				children: [
					{path: 'create', title: 'Crear usuario', ab: 'CU'},
					{path: 'view', title: 'Ver usuarios', ab: 'VU'}
				]
		},{
				path: '/oportunities',
				title: 'Oportunidades',
				type: 'sub',
				icontype: 'flag',
				collapse: 'oportunidades',
				children: [
					{path: 'create', title: 'Crear oportunidad', ab: 'CO'},
					{path: 'view', title: 'Ver oportunidades', ab: 'VO'}
				]
		},{
				path: '/accounts',
				title: 'Cuentas',
				type: 'sub',
				collapse: 'cuentas',
				icontype: 'apartment',
				children: [
					{path: 'create', title: 'Crear cuenta', ab: 'CC'},
					{path: 'view', title: 'Ver cuentas', ab: 'VC'}
				]
		},{
				path: '/business',
				title: 'Negocios',
				type: 'sub',
				icontype: 'attach_money',
				collapse: 'negocios',
				children: [
					{path: 'create', title: 'Crear negocio', ab: 'CN'},
					{path: 'view', title: 'Ver negocios', ab: 'VN'}
				]
		},{
				path: '/charts',
				title: 'Reportes',
				type: 'link',
				icontype: 'timeline'
		},{
			path: '/admin',
			title: 'Administrador',
			type: 'link',
			icontype: 'settings_applications'
		}
];


@Component({
	selector: 'app-sidebar-cmp',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

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
		this.identity = this.userService.getidentity();
		this.image = this.userService.getUserImage().subscribe(data => {
			this.createImageFromBlob(data);
		}, err => {
			console.log(err);
		});
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
