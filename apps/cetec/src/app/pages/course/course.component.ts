import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { PagesService } from '../pages.service';
import { UserCourseService, CommonService } from '@mat-libreta/shared';
import { environment } from '@cjaenv/environment';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
	providers: [PagesService]
})
export class CourseComponent implements OnInit, AfterViewInit {

	loading: boolean;
  costo: number;
  cursos: any = [];
  curso: any = [];
  blocks: any = [];
  sections: any [] = [];
  contents: any [] = [];
  idc: string;
  modaltype: any;
  members = 0;
  maxmembers: number [] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
	color: string;
	margin: number = 20;
	token: string;

  constructor(
		private activeRoute: ActivatedRoute,
		private router: Router,
		private pagesService: PagesService,
		private userCourseService: UserCourseService,
		private commonService: CommonService
	) {
		this.color = environment.color;
    this.activeRoute.params.subscribe( params =>{
      if (params.id != null) {
        this.idc = params.id;
      }
    });
		this.token = this.commonService.getToken();
	}

  ngOnInit() {
		this.getCourse(this.idc);
  }

	ngAfterViewInit() {
		let $navbar = document.getElementsByClassName('navbar')[0];
		$navbar.classList.remove('navbar-transparent');
		// $navbar.classList.remove('bg-primary');
		// $navbar.classList.add('bg-white');
	}

	getCourse(id:string){
    this.loading = true;
		this.pagesService.getCourse(id).subscribe(data => {
			// console.log(data);
			this.curso = data;
			if(!this.curso.discount) {
				this.curso.discount = 10;
			}
		}, error => {
			Swal.fire({
				type: 'error',
				html: 'No existe el curso solicitado o hubo un error en el servidor<br>Regresa y corrige'
			});
			this.router.navigate(['/pages/catalog']);
		});
    // this.pagesService.getCoursesOrg().subscribe(data => {
		// 	console.log(data);
		// 	if(data && data.body && data.body.message && data.body.message.courses){
	  //     this.cursos = data.body.message.courses;
	  //     this.curso = this.cursos.find((c:any) => c.id == id);
		// 	}
    //   this.loading = false;
    // });

    this.pagesService.showBlocks(id).subscribe(data => {
			if(data && data.body && data.body.message && data.body.message.blocks) {
      	this.blocks = data.body.message.blocks;
			}
      this.loading = false;
    });
  }

	tutorCourse() {
		Swal.fire({
			type: 'info',
			html: 'Este curso debes solicitarlo a <a href="mailto:dirproyectos@grupocetec.com">dirproyectos@grupocetec.com</a>.<br>Ya que es un curso tutorado, tiene requerimientos de número de alumnos y disponibilidad del tutor. Una vez que esto se cumpla te llegarán instrucciones para asistir a este curso.'
		});
	}

	goEnroll(courseid:string, courseTitle: string) {
		if(!this.token) {
			// Swal.fire({
			// 	type: 'info',
			// 	html: 'Registrate antes de inscribirte<br><small>(Revisa en el menú superior)</small>'
			// });
			// return;
			Swal.fire({
				type: 'info',
				html: `<h3>Antes de inscribirte, necesitas registrarte</h3><p class="text-justify">Lee los términos y condiciones de registro e ingresa tus datos.</p><p class="text-justify">Después, revisa tu correo y sigue ahí las instrucciones para inscribirte al curso:</p> <h3>${courseTitle}</h3><p class="text-justify"><small>Si el correo tarda mucho en llegar, revisa la bandeja de correos no deseados</small></p><p class="text-justify">Si ya estábas inscrito, no llenes el formulario, solo presiona en <b>"Si ya te has registrado previamente ingresa aquí"</b>, o en <b>"Ingresa"</b> en el menú superior para ingresar al sistema.</p>`
			});
			localStorage.setItem('wantedCourse',courseid);
			this.router.navigate(['/pages/catalog']);
			return;
		}
		Swal.fire('Espera...');
		Swal.showLoading();
		this.userCourseService.enroll(courseid).subscribe(data => {
			// console.group('data');
			// console.log(data);
			// console.groupEnd();
			if(data && data.message) {
				Swal.hideLoading();
				Swal.close();
				var successMessage = 'Te has inscrito al curso ';
				var regex = /Te has inscrito al curso /gi;
				if(data.message.includes(successMessage)) {
					Swal.fire({
						type: 'info',
						html: `${successMessage} <b>${data.message.replace(regex,'')}</b>`
					});
					var coursesNumber = +localStorage.getItem('courses');
					coursesNumber++;
					localStorage.setItem('courses',coursesNumber+'');
					this.router.navigate(['/dashboard']);
					return;
				}
				// console.group('data');
				// console.log(data);
				// console.groupEnd();
				Swal.fire({
					type: 'warning',
					text: data.message
				});
			}
		}, error => {
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				html: 'Lo sentimos. Al parecer hubo un error en el servidor al intentar inscribirte en este curso.<br>Pudiera ser un error temporal, así que te sugerimos intentar unos minutos más tarde.<br><small>Si después de unos minutos el error persiste, puedes notificarnos usando el servicio de <b>Asistencia</b> que se encuentra debajo de esta pantalla</small>'
			});
			console.log(error);
		});
	}

  verCurso(curso:string) {
    this.router.navigate(['/pages/course',curso]);
  }

}
