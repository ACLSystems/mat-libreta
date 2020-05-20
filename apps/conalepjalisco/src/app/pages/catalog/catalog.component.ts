import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { PagesService } from '../pages.service';
import { environment } from '@cjaenv/environment';

// export class Areas {
// 	constructor(
// 		public area: string
// 	) {}
// }

@Component({
	selector: 'app-catalog',
	templateUrl: './catalog.component.html',
	styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, AfterViewInit, OnDestroy {

	loading:boolean;
	isFindOk:boolean;
	org:string;
	query1:any;
	// ar:Areas;
	messageNotFound:string;

	typesdata:any[]=[];
	carrerasList:any[]=[];
	areadata:any[]=[];
	cursoslist:any[]=[];
	course:any[]=[];
	keywords:any[]=[];
	instanceName:string;
	instanceTitle:string;
	instanceNameCase:string;
	logo:string;
	color:string;
	categories:string[]=[];

	constructor(
		private pagesService: PagesService,
		private router: Router
	) {
		this.org = environment.instanceName;
		this.instanceTitle = environment.instanceTitle;
		this.instanceNameCase = environment.instanceName.toUpperCase();
		this.logo = environment.logo;
		this.color = environment.color;
		// this.ar = new Areas('');
		// this.getAreas();
		// this.verGrados();
		this.getCourseList();
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		let $navbar = document.getElementsByClassName('navbar')[0];
		$navbar.classList.remove('navbar-transparent');
		// $navbar.classList.remove('bg-primary');
		$navbar.classList.add('bg-primary');
	}

	getCourseList(){
		this.loading = true;
		this.pagesService.getCoursesOrg().subscribe(data =>{
			if(data && data.body && data.body.message && data.body.message.courses) {
				this.cursoslist = data.body.message.courses.filter((course:any) => course.isVisible && course.status === 'published');
				this.loading = false;
				// console.log(this.cursoslist);
				this.categories = [];
				this.cursoslist.forEach(course => {
					if(course.categories && Array.isArray(course.categories) && course.categories.length > 0) {
						this.categories = this.categories.concat(course.categories);
					}
				});
				this.categories = [...new Set(this.categories)];
				// console.log(this.categories);
			}
		},error=>{
			console.log(error.message);
			this.loading = false;
		});
	}
	//
	// getAreas(){
	// 	this.pagesService.getAreas(this.org).subscribe(data=>{
	// 		console.log(data);
	// 		if(data && data.body && data.body.message && data.body.message.details){
	// 			this.areadata = data.body.message.details;
	// 		}
	// 	},error=>{
	// 		console.log(error);
	// 	});
	// }
	// //
	// verCarrera(){
	// 	this.query1={
	// 		area:this.ar.area
	// 	};
	// 	this.pagesService.getCarreras(this.org, this.query1).subscribe(data=>{
	// 		this.carrerasList = data.body.message.results;
	// 	},error=>{
	// 		console.log(error);
	// 	});
	// }
	// //
	// verGrados(){
	// 	var type = "semester"
	// 	this.query1={
	// 		type:type
	// 	};
	// 	this.pagesService.getTerms(this.org,this.query1).subscribe(data=>{
	// 		this.typesdata = data.body.message.results;;
	// 	},error=>{
	// 		console.log(error);
	// 	});
	// }

	verCurso(curso:any){
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
		// $navbar.classList.remove('bg-white');
		$navbar.classList.add('bg-primary');
		// console.log($navbar.classList);
	}

}

function orderCourses(courses: any[]) {
	// console.group('Cursos');
	// console.log(courses);
	// console.groupEnd()
	const coursesFiltered = courses.filter(course => course.isVisible && course.status === 'published');
	// console.group('Cursos filtrados');
	// console.log(coursesFiltered);
	// console.groupEnd();
	var newCourses = [];
	const columns = 3;
	const colSize = Math.floor(coursesFiltered.length / columns);
	const modSum = coursesFiltered.length % columns;
	// console.log('calculations: ', colSize, modSum);
	var index = 0;
	for(var i=0; i<columns; i++) {
		for(var j=0; j<colSize; j++) {
			index = i+(j*columns);
			if(!coursesFiltered[index]) {
				// console.log('MOLE!!!')
				// console.log(index)
				// console.log(coursesFiltered[index])
			}
			newCourses.push(coursesFiltered[index]);
		}
		if(modSum === 2 && i === 0) {
			index = i+(j*columns);
			if(!coursesFiltered[index]) {
				// console.log('MOLE!!! -- i == 0')
				// console.log(index)
				// console.log(coursesFiltered[index])
			}
			newCourses.push(coursesFiltered[index]);
		}
		if(modSum > 0 && i === 1) {
			index = i+(j*columns);
			if(!coursesFiltered[index]) {
				// console.log('MOLE!!! -- i == 1')
				// console.log(index)
				// console.log(coursesFiltered[index])
			}
			newCourses.push(coursesFiltered[index]);
		}
	}
	// console.group('Cursos reordenados');
	// console.log(newCourses);
	// console.groupEnd();
	return newCourses;
}
