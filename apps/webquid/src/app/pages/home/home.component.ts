import { Component, OnInit, HostListener } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Identity } from '@wqshared/types/user.type';

// import { PagesService } from '../pages.service';
// import { UserService } from '@wqshared/services/user.service';
// import { environment } from '@wqenv/environment';

@Component({
	selector: 'webquid-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	p:number = 1;
	public index:number;
	public token: string;
	public identity: Identity;
	public loading:boolean = false;
	// public cursos:any;
	// public environment: any;
	// public color: string;
	// public numCursos: number;
	// public curso:any;
	// public blocks:any;
	/*
	Constructor de la clase
	*/
	constructor(
		private _router:Router,
		private Meta:Meta,
		// private pagesService:PagesService,
		// private userService: UserService
	) {
		this.Meta.addTag(
			{
				name:'description',
				content:'GIN group Portal de Servicios'
			}
		);
	}

	ngOnInit() {
	}

	// @HostListener('window:scroll', ['$event'])
	// scrollHandler(event?:any) {
	// 	let pos = document.documentElement.scrollTop;
	// 	let $navbar = document.getElementsByClassName('navbar')[0];
	// 	if(pos > 100){
	// 		$navbar.classList.remove('navbar-transparent');
	// 		$navbar.classList.remove('bg-primary');
	// 		$navbar.classList.add('bg-light');
	// 	} else {
	// 		$navbar.classList.add('navbar-transparent');
	// 		$navbar.classList.remove('bg-light');
	// 		$navbar.classList.add('bg-primary');
	// 	}
	// }
}
