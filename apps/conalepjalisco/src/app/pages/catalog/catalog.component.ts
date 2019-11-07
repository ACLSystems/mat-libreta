import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { PagesService } from '../pages.service';
import { environment } from '@cjaenv/environment';

export class Areas {
	constructor(
		public area: string
	) {}
}

@Component({
	selector: 'app-catalog',
	templateUrl: './catalog.component.html',
	styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, AfterViewInit, OnDestroy {

	public loading:boolean;
	public isFindOk:boolean;
	public org:string;
	public query1:any;
	public ar:Areas;
	public messageNotFound:string;

	public typesdata:any[]=[];
	public carrerasList:any[]=[];
	public areadata:any[]=[];
	public cursoslist:any[]=[];
	public course:any[]=[];
	public keywords:any[]=[];
	public instanceName:string;
	public instanceTitle:string;
	public instanceNameCase:string;
	public logo:string;
	public color:string;

	constructor(
		private pagesService: PagesService,
		private router: Router
	) {
		this.org = environment.instanceName;
		this.instanceTitle = environment.instanceTitle;
		this.instanceNameCase = environment.instanceName.toUpperCase();
		this.logo = environment.logo;
		this.color = environment.color;
		this.ar = new Areas('');
		this.getAreas();
		this.verGrados();
		this.getCourseList();
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		let $navbar = document.getElementsByClassName('navbar')[0];
		$navbar.classList.remove('navbar-transparent');
		// $navbar.classList.remove('bg-primary');
		// $navbar.classList.add('bg-white');
	}

	public getCourseList(){
		this.loading = true;
		this.pagesService.getCoursesOrg().subscribe(data =>{
			this.cursoslist = data.body.message.courses;
			this.loading = false;
		},error=>{
			console.log(error.message);
			this.loading = false;
		});
	}
	//
	public getAreas(){
		this.pagesService.getAreas(this.org).subscribe(data=>{
			if(data && data.body && data.body.message && data.body.message.details){
				this.areadata = data.body.message.details;
			}
		},error=>{
			console.log(error);
		});
	}
	//
	public verCarrera(){
		this.query1={
			area:this.ar.area
		};
		this.pagesService.getCarreras(this.org, this.query1).subscribe(data=>{
			this.carrerasList = data.body.message.results;
		},error=>{
			console.log(error);
		});
	}
	//
	public verGrados(){
		var type = "semester"
		this.query1={
			type:type
		};
		this.pagesService.getTerms(this.org,this.query1).subscribe(data=>{
			this.typesdata = data.body.message.results;;
		},error=>{
			console.log(error);
		});
	}

	public verCurso(curso:any){
		this.router.navigate(['/pages/course',curso]);
	}

	/*
	metodo de busqueda para los cursos
	*/
	findCourse(wordcode:string){
		this.loading = true;
		this.course=[]
		if(wordcode!=''){
			for(let id of this.cursoslist){
				if(id.title.toLowerCase().includes(wordcode.toLowerCase())){
					this.course.push(id);
				}
			}
			if(this.course.length!=0){
				this.loading = false;
				this.isFindOk = true;
			}else{
				this.isFindOk = false;
				this.loading = false;
				this.messageNotFound = "No se encontraron resultados para la busqueda de: "+wordcode
			}
		}else{
			this.isFindOk = false;
			this.loading = false;
			this.messageNotFound = null
		}
	}

	ngOnDestroy() {
		let $navbar = document.getElementsByClassName('navbar')[0];
		$navbar.classList.add('navbar-transparent');
		$navbar.classList.remove('bg-white');
		$navbar.classList.add('bg-primary');
	}

}
