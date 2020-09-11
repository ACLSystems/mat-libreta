import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';

import {
	Identity,
	UserService,
	CommonService
} from '@mat-libreta/shared';

import { PagesService } from '../pages.service';
// import { environment } from '@cjaenv/environment';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
	p					: number = 1;
	index			: number;
	token			: string;
	identity	: Identity;
	loading		: boolean = false;
	cursos		: any;
	// public environment: any;
	color			: string;
	numCursos	: number;
	curso			: any;
	blocks		: any;
	bigWhiteLogo 	: string;
	instanceName 	: string;
	university		: boolean;
	/*
	Constructor de la clase
	*/
	constructor(
		private _router:Router,
		private Meta:Meta,
		private pagesService:PagesService,
		private userService: UserService,
		private commonService: CommonService,
		private sg: SimpleGlobal
	) {
		// this.Meta.addTag(
		// 	{
		// 		name:'description',
		// 		content:'Supérate Mexico es una iniciativa de capacitación en línea que te ayuda en tu desarrollo profesional, adquiriendo nuevas competencias y dándole valor a tus conocimientos'
		// 	}
		// );
		// this.environment = environment.production;
		this.color = this.sg['instance']?.color?.name;
		this.bigWhiteLogo = this.sg['instance']?.logo?.bigWhite;
		this.instanceName = this.sg['instance']?.instance?.name;
		this.university = this.sg['instance']?.platform?.university;
		// console.log('color',this.color);
		this.identity = this.userService.getidentity();
		this.token = this.userService.getToken();
		this.index = 0;
	}

	ngOnInit() {

		// if(this.token){
		// 	// this._router.navigate(['/consoleuser']);
		// 	this._router.navigate(['/pages/home']);
		// }else{
		// 	this._router.navigate(['/pages/home']);
		// }
		if(!this.color) {
			setTimeout(() => {
				this.color = this.sg['instance'].color?.name;
				this.getCourseList();
			}, 801);
		} else {
			this.getCourseList();
		}
	}

	getCourseList(){
		this.loading = true;
		this.pagesService.getCoursesOrg().subscribe(data =>{
			this.cursos = [...data];
			this.commonService.displayLog('Home Page Courses',this.cursos);
			this.loading = false;
			this.curso = this.cursos[this.index];
			this.traeTemario(this.curso._id);
		},error=>{
			console.log(error.message);
		});
	}

	verCurso(curso:string){
		this._router.navigate(['/curso',curso]);
	}

	cambiaCurso(code:string) {
		this.curso = this.cursos.find( (crs:any) => crs.code === code);
		this.traeTemario(this.curso._id);
	}

	traeTemario(id:string) {
		this.loading = true;
		this.pagesService.showBlocks(id).subscribe(data => {
			console.log(data);
			this.blocks = [...data];
			this.loading = false;
		});
	}

	@HostListener('window:scroll', ['$event'])
	scrollHandler(event?:any) {
		let pos = document.documentElement.scrollTop;
		let $navbar = document.getElementsByClassName('navbar')[0];
		if(pos > 100){
			$navbar.classList.remove('navbar-transparent');
			// $navbar.classList.remove('bg-primary');
			$navbar.classList.add('bg-light');
		} else {
			$navbar.classList.add('navbar-transparent');
			$navbar.classList.remove('bg-light');
			$navbar.classList.add('bg-primary');
		}
	}

	ngAfterViewInit() {
		let $navbar = document.getElementsByClassName('navbar')[0];
		$navbar.classList.add('navbar-transparent');
		$navbar.classList.add('bg-primary');
		$navbar.classList.remove('bg-white');
	}
}
