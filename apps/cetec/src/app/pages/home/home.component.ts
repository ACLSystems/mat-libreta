import { Component, OnInit, HostListener } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Identity } from '@cetecshared/types/user.type';

import { PagesService } from '../pages.service';
import { UserService } from '@cetecshared/services/user.service';
import { environment } from '@cetecenv/environment';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	p:number = 1;
	public index:number;
	public token: string;
	public identity: Identity;
	public loading:boolean = false;
	public cursos:any;
	public environment: any;
	public color: string;
	public numCursos: number;
	public curso:any;
	public blocks:any;
	/*
	Constructor de la clase
	*/
	constructor(
		private _router:Router,
		private Meta:Meta,
		private pagesService:PagesService,
		private userService: UserService
	) {
		this.Meta.addTag(
			{
				name:'description',
				content:'Supérate Mexico es una iniciativa de capacitación en línea que te ayuda en tu desarrollo profesional, adquiriendo nuevas competencias y dándole valor a tus conocimientos'
			}
		);
	}

	ngOnInit() {
		this.environment = environment.production;
		this.color = environment.color;
		this.identity = this.userService.getidentity();
		this.token = this.userService.getToken();
		this.index = 0;
		if(this.token){
			// this._router.navigate(['/consoleuser']);
			this._router.navigate(['/pages/home']);
		}else{
			this._router.navigate(['/pages/home']);
		}
		this.getCourseList();
	}

	public getCourseList(){
		this.loading = true;
		this.pagesService.getCoursesOrg().subscribe(data =>{
			this.cursos = data.body.message.courses;
			this.loading = false;
			this.curso = this.cursos[this.index];
			this.traeTemario(this.curso.id);
		},error=>{
			console.log(error.message);
		});
	}

	public verCurso(curso:string){
		this._router.navigate(['/curso',curso]);
	}

	public cambiaCurso(code:string) {
		this.curso = this.cursos.find( (crs:any) => crs.code === code);
		this.traeTemario(this.curso.id);
	}

	public traeTemario(id:string) {
		this.loading = true;
		this.pagesService.showBlocks(id).subscribe(data => {
			this.blocks = data.body.message.blocks;;
			this.loading = false;
		});
	}

	@HostListener('window:scroll', ['$event'])
	scrollHandler(event?:any) {
		let pos = document.documentElement.scrollTop;
		let $navbar = document.getElementsByClassName('navbar')[0];
		if(pos > 100){
			$navbar.classList.remove('navbar-transparent');
			$navbar.classList.remove('bg-primary');
			$navbar.classList.add('bg-light');
		} else {
			$navbar.classList.add('navbar-transparent');
			$navbar.classList.remove('bg-light');
			$navbar.classList.add('bg-primary');
		}
	}
}
