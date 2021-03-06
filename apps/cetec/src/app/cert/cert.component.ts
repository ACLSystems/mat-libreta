import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CertService } from './cert.service';
import { UserCourseService, Grade } from '@mat-libreta/shared';
import { Certificates } from './docs';

const rosterType = 'group';

@Component({
  selector: 'mat-libreta-cert',
  templateUrl: './cert.component.html',
  styleUrls: ['./cert.component.scss'],
	providers: [
		UserCourseService,
		CertService
	]
})
export class CertComponent implements OnInit {

	loading: boolean;
	rosterType: string;
	id: string;
	grade: Grade;
	track: number;
	minTrack: number;
	poll: boolean;

  constructor(
		private activatedRoute: ActivatedRoute,
		private userCourseService: UserCourseService,
		private certService: CertService,
		private router: Router
	) {
		this.activatedRoute.params.subscribe(params => {
				this.rosterType = params.rostertype;
				this.id = params.id;
			}
		);
		this.poll = false;
		// console.group('constructor rosterType');
		// console.log(this.rosterType);
		// console.groupEnd();
	}

  ngOnInit() {
		this.getGrades();
  }

	getGrades() {
		this.loading = true;
		this.userCourseService.getMyGrades(this.rosterType, this.id).subscribe(data => {
			this.grade = data.message;
			// console.log(this.grade);
			if(data && data.message && typeof data.message === 'string' && data.message.includes('No estás inscrito')) {
				Swal.fire({
					type: 'error',
					text: 'Hay un error, porque no estás inscrito en este curso. Contacta a la mesa de servicio'
				});
				this.loading = false;
				this.router.navigate(['/dashboard']);
				return;
			}
			this.track = +this.grade.track.replace('%','');
			this.minTrack = +this.grade.minTrack.replace('%','');
			this.loading = false;
			// if(this.grade.status === 'pending'){
			// 	Swal.fire({
			// 		type: 'warning',
			// 		title: 'Pago Requerido',
			// 		text: 'Para obtener la constancia del curso solicitado se requiere el pago de la misma. En la siguiente pantalla podrás obtener instrucciones para realizar el pago presionando el botón "Cómo obtener constancia"'
			// 	});
			// 	this.router.navigate(['/user/progress', this.groupid]);
			// }
			// console.group('Grade');
			// console.log(this.grade);
			// console.groupEnd();
		}, error => {
			Swal.fire({
				type: 'error',
				title: 'Error de comunicación con el servidor',
				text: 'El servidor nos respondió con un error. Puede ser temporal, por lo que te sugerimos intentar nuevamente en un minuto.',
				footer: 'En caso de que este error se presente continuamente, favor de reportarlo a soporte@soporte con este número de error: 1234'
			});
			console.log(error);
		});
	}

	releaseCert() {
		Swal.fire({
			type: 'info',
			html: 'Se abrirá otra pantalla para que realices una encuesta.<br>Al terminar, regresa a esta pantalla y presiona el botón: <button mat-raised-button class="btn btn-sm btn-success"> 2. Descargar Constancia</button>',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Realizar encuesta'
		}).then(result=> {
			if(result.value) {
				this.poll = true;
				this.router.navigate([]).then(() =>
					{window.open('https://forms.gle/TBb4B44zxZFbg7hK9', '_blank')});
			}
		});
	}

	getCert() {
 		this.userCourseService.getUserConst(this.rosterType,this.id).subscribe(data => {
			if(data.message === 'Roster saved') {
				if(this.grade.finalGrade >= this.grade.minGrade) {
					// console.group('this.grade');
					// console.log(this.grade);
					// console.groupEnd()
					this.certService.printCertificate(
						Certificates.constancia_acreditacion,
						this.grade.certificateNumber,
						this.grade.name,
						this.grade.course,
						this.grade.duration + '',
						this.grade.durationUnits,
						this.grade.passDateSpa
					);
				}
			} else {
				Swal.fire({
					type: 'warning',
					text: `Hubo un problema al descargar la constancia: ${data.message}`
				});
			}
		});
		localStorage.removeItem('cert');
	}
}
