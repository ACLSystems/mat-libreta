import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

import { Identity } from '@wqshared/types/user.type';
//
import { UserService } from '@wqshared/services/user.service';

declare const $: any;

//Metadata
export interface RouteInfo {
		path: string;
		title: string;
		type: string;
		icontype: string;
		collapse?: string;
		role: string;
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
			path: '/services',
			title: 'Servicios',
			type: 'link',
			role: 'all',
			icontype: 'room_service'
		},{
			path: '/super',
			title: 'Supervisión',
			type: 'link',
			role: 'isSupervisor',
			icontype: 'supervisor_account',
			collapse: 'Supervisión'
		},{
			path: '/oper',
			title: 'Operación',
			type: 'link',
			role: 'isOperator',
			icontype: 'computer',
			collapse: 'Operación',
		},{
			path: '/admin',
			title: 'Administración',
			type: 'link',
			role: 'isTechAdmin',
			icontype: 'domain',
			collapse: 'Administración'
		},{
			path: '/billing',
			title: 'Facturación',
			type: 'link',
			role: 'isBillAdmin',
			icontype: 'attach_money',
			collapse: 'Administración'
		},{
			path: '/config',
			title: 'Configuración',
			type: 'link',
			role: 'isAdmin',
			icontype: 'settings'
		}
		// {
		// 		path: '/calendar',
		// 		title: 'Calendario',
		// 		type: 'link',
		// 		icontype: 'date_range'
		// },{
		// 		path: '/users',
		// 		title: 'Usuarios',
		// 		icontype: 'people',
		// 		type: 'link'
				// type: 'sub',
				// collapse: 'usuarios',
				// children: [
				// 	{path: 'create', title: 'Crear usuario', ab: 'CU'},
				// 	{path: 'view', title: 'Ver usuarios', ab: 'VU'}
				// ]
		// },{
		// 		path: '/accounts',
		// 		title: 'Cuentas',
		// 		icontype: 'apartment',
		// 		type: 'link'
				// type: 'sub',
				// collapse: 'cuentas',
				// children: [
				// 	{path: 'create', title: 'Crear cuenta', ab: 'CC'},
				// 	{path: 'view', title: 'Ver cuentas', ab: 'VC'}
				// ]
		// },{
		// 		path: '/quotes',
		// 		title: 'Cotizaciones',
		// 		icontype: 'shopping_cart',
		// 		type: 'link'
				// type: 'sub',
				// collapse: 'oportunidades',
				// children: [
				// 	{path: 'create', title: 'Crear oportunidad', ab: 'CO'},
				// 	{path: 'view', title: 'Ver oportunidades', ab: 'VO'}
				// ]
		// },{
		// 		path: '/opportunities',
		// 		title: 'Oportunidades',
		// 		icontype: 'flag',
		// 		type: 'link'
				// type: 'sub',
				// collapse: 'oportunidades',
				// children: [
				// 	{path: 'create', title: 'Crear oportunidad', ab: 'CO'},
				// 	{path: 'view', title: 'Ver oportunidades', ab: 'VO'}
				// ]
		// },{
		// 		path: '/business',
		// 		title: 'Negocios',
		// 		icontype: 'attach_money',
		// 		type: 'link'
				// type: 'sub',
				// collapse: 'negocios',
				// children: [
				// 	{path: 'create', title: 'Crear negocio', ab: 'CN'},
				// 	{path: 'view', title: 'Ver negocios', ab: 'VN'}
				// ]
		// },{
		// 		path: '/reports',
		// 		title: 'Reportes',
		// 		type: 'link',
		// 		icontype: 'timeline'
		// },{
		// 	path: '/admin',
		// 	title: 'Administrador',
		// 	type: 'link',
		// 	icontype: 'settings_applications'
		// }
];


@Component({
	selector: 'webquid-sidebar-cmp',
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
		if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
				const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
				this.ps = new PerfectScrollbar(elemSidebar);
		}
		this.identity = this.userService.getidentity();
		// this.image = this.userService.getUserImage().subscribe(data => {
		// 	this.createImageFromBlob(data);
		// }, err => {
		// 	console.log(err);
		// });
		const menuAll = ROUTES.filter(item => item.role === 'all');
		if(this.identity.roles) {
			const menuAdmin = this.identity.roles.isAdmin ? ROUTES.filter(item => item.role === 'isAdmin') : [];
			const menuSuper = this.identity.roles.isSupervisor ? ROUTES.filter(item => item.role === 'isSupervisor') : [];
			const menuOperator = this.identity.roles.isOperator ? ROUTES.filter(item => item.role === 'isOperator') : [];
			const menuTech = this.identity.roles.isTechAdmin ? ROUTES.filter(item => item.role === 'isTechAdmin') : [];
			const menuBill = this.identity.roles.isBillAdmin ? ROUTES.filter(item => item.role === 'isBillAdmin') : [];
			this.menuItems = [
				...menuAll,
				...menuSuper,
				...menuOperator,
				...menuTech,
				...menuBill,
				...menuAdmin
			];
		} else {
			this.menuItems = [
				...menuAll
			];
		}
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
