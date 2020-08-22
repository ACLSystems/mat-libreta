import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CertService } from './cert.service';
import { Drawing } from './cert.model';
import {
	UserCourseService,
	Grade,
	CommonService
} from '@mat-libreta/shared';
import { Certificates } from './docs';

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
	bank: string;
	bankAccount: string;
	bankCLABE: string;
	mocAmount: string;
	data: string;
	drawing: Drawing | null;
	survey: string;

  constructor(
		private activatedRoute: ActivatedRoute,
		private userCourseService: UserCourseService,
		private certService: CertService,
		private router: Router,
		private commonService: CommonService
	) {
		this.activatedRoute.params.subscribe(params => {
				this.rosterType = params.rostertype;
				this.id = params.id;
			}
		);
		this.poll = false;
		this.bank = this.commonService.getEnvironment().bank;
		this.bankAccount = this.commonService.getEnvironment().bankAccount;
		this.bankCLABE = this.commonService.getEnvironment().bankCLABE;
		this.mocAmount = this.commonService.getEnvironment().mocAmount;
	}

  ngOnInit() {
		this.loading = true;
		this.getGrades();
  }

	getGrades() {
		this.userCourseService.getMyGrades(this.rosterType,this.id).subscribe(data => {
			this.grade = data.message;
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
			this.commonService.displayLog('Grade',this.grade);
			// this.commonService.displayLog('Payed',this.grade.folioStatus);
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

	print() {
		window.print();
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
				Swal.fire('Espera...');
				Swal.showLoading();
				this.userCourseService.getCertTemplate(this.grade.rosterid).subscribe(data => {
					this.data = data.data || null;
					this.drawing = data.drawing || null;
					this.survey = data.survey || null;
					// console.log(this.drawing);
					// console.log(this.survey);
					if(this.survey) {
						this.poll = true;
						this.router.navigate([]).then(() =>
						{window.open(this.survey, '_blank')});
					}
					Swal.hideLoading();
					Swal.close();
				}, error => {
					Swal.hideLoading();
					Swal.close();
					console.log(error);
					Swal.fire({
						type: 'error',
						html: `Hubo un error ${error}`
					})
				});
				// this.poll = true;
				// this.router.navigate([]).then(() =>
				// 	{window.open('https://forms.gle/cuTZHJ12amgcExTx8', '_blank')});
			}
		});
	}

	getCert() {
 		if(!this.data || !this.drawing) {
			Swal.fire('Espera...');
			Swal.showLoading();
			this.userCourseService.getCertTemplate(this.grade.rosterid).subscribe(data => {
				this.data = data.data || null;
				this.drawing = data.drawing || null;
				this.launchCert();
			}, error => {
				console.log(error);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					html: `Hubo un error ${error}`
				})
			})
		} else {
			this.launchCert();
		}
	}

	launchCert() {
		this.commonService.displayLog('Drawing',this.drawing);
		this.userCourseService.getUserConst(this.rosterType, this.id).subscribe(data => {
			if(data.message === 'Roster saved') {
				if(this.grade.finalGrade >= this.grade.minGrade) {
					const endDate = this.grade.presentedEndDate ?
						this.grade[this.grade.presentedEndDate + 'Spa']
					:
						this.grade.passDateSpa;
					const period = this.grade.rosterType === 'group' && this.drawing.period && this.drawing.period.enabled ?
						`${this.grade.beginDateSpa} al ${this.grade.endDateSpa}`: null;
					this.certService.printCertificate(
						this.drawing,
						this.data,
						(this.grade.certificateNumber+'').padStart(6,'0'),
						this.grade.name,
						this.grade.course,
						this.grade.finalGrade + '',
						this.grade.duration + '',
						this.grade.durationUnits,
						endDate,
						false,
						period
					);
				}
			}
			Swal.hideLoading();
			Swal.close();
		}, error => {
			Swal.hideLoading();
			Swal.close();
			console.log(error);
			Swal.fire({
				type: 'error',
				html: `Hubo un error ${error}`
			})
		});
		localStorage.removeItem('cert');
	}
}
