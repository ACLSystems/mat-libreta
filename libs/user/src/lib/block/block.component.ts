import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import {
	UserCourseService,
	NotElemService,
	CommonService,
	Block
} from '@mat-libreta/shared';


@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
	providers: [
		UserCourseService
	]
})
export class BlockComponent implements OnInit {

	id: string;
	rosterType: string;
	blockid: string;
	loading: boolean;
	blockData: Block;
	closeCourse: boolean = false;


  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userCourseService: UserCourseService,
		private notElementService: NotElemService,
		private commonService: CommonService
	) {
		this.loading = true;
		this.activatedRoute.params.subscribe(params => {
			this.rosterType = params.rostertype;
			this.id = params.id;
			this.blockid = params.blockid;
		})
	}

  ngOnInit() {
		// console.log(this.rosterType);
		this.commonService.displayLog('rosterType', this.rosterType);
		this.commonService.displayLog('id', this.id);
		this.commonService.displayLog('blockid', this.blockid);
		this.loading = true;
		this.getNextBlock(this.rosterType,this.id,this.blockid);
  }

	getNextBlock(
		rosterType:string,
		id:string,
		blockid:string,
		lastid?:string) {
		this.userCourseService.getNextBlock(rosterType,id,blockid,lastid)
		.subscribe(data => {
			this.commonService.displayLog('Data NextBlock', data);
			if(data) {
				if(typeof data.message === 'string') {
					Swal.fire({
						type: 'warning',
						text: data.messageUser || data.message
					});
					this.goGroup(this.rosterType,id);
				} else {
					this.blockData = data.message;
					const lastid = this.blockid;
					this.blockid = blockid;

					if(this.blockData.blockType === 'task') {
						// this.blockGrade = this.blockData.blockGrade;
						// this.blockGradedT = this.blockData.blockGradedT;
					}
					// console.group('block')
					// console.log(this.blockData);
					// console.groupEnd();
					if(!this.blockData.blockNextId || this.blockData.blockNextId === '') {
						// this.notElementService.showNotification(
						// 	'bottom',
						// 	'left',
						// 	'warning',
						// 	'<i class="fas fa-stop text-white"></i> Has llegado al final del curso. Si ya realizaste tus evaluaciones, revisa tu progreso y descarga tu constancia'
						// );
						this.closeCourse = true;
					}
					var currentCourse = JSON.parse(localStorage.getItem('currentCourse'));
					if(currentCourse) {
						currentCourse.block = currentCourse.block ? lastid : currentCourse.block;
						localStorage.setItem('currentCourse',JSON.stringify(currentCourse));
					}
				}
				window.scroll(0,0);
				this.loading = false;
			}
		}, error => {
			Swal.fire({
				type: 'error',
				text: 'Hubo un error al intentar descargar la lección. Por favor intenta nuevamente más tarde. Si esto se repite varias veces en un lapse de dos horas, por favor, notifícalo a la mesa de servicio usando el botón de "Asistencia"'
			});
			console.log(error);
			this.loading = false;
		})
	}

	goCloseCourse(
		rosterType:string,
		id:string,
		blockid:string) {
		this.userCourseService.getNextBlock(rosterType,id,blockid,blockid)
		.subscribe(data => {
			// console.group('data block')
			// console.log(data)
			// console.groupEnd()
			if(data) {
				if(typeof data.message === 'string' && data.message.includes('Block cannot be displayed because')) {
					Swal.fire({
						type: 'warning',
						text: data.messageUser
					});
					this.goGroup(this.rosterType,id);
				} else {
					Swal.fire({
						type: 'success',
						text: 'Felicidades, has terminado tu curso. Ahora iras a la página de progreso para ver tus calificaciones y poder tramitar tu constancia. ¡Enhorabuena!'
					});
				}
				this.router.navigate(['/user/progress',rosterType,id]);
				this.loading = false;
			}
		}, error => {
			Swal.fire({
				type: 'error',
				text: 'Hubo un error al intentar cerrar el curso. Por favor intenta nuevamente más tarde. Si esto se repite varias veces en un lapso de dos horas, por favor, notifícalo a la mesa de servicio usando el botón de "Asistencia"'
			});
			console.log(error);
			this.loading = false;
		});
		// this.notElementService.showNotification(
		// 	'bottom',
		// 	'left',
		// 	'warning',
		// 	'<i class="fas fa-stop text-white"></i> Has llegado al final del curso. Si ya realizaste tus evaluaciones, revisa tu progreso y descarga tu constancia'
		// );

	}

	goGroup(rosterType: string, id:string) {
		this.router.navigate(['/user/content', rosterType, id])
	}

}
