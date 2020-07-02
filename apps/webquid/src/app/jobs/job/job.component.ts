import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { CommonService } from '@wqshared/services/common.service';
import { JobsService } from '@wqshared/services/jobs.service';

@Component({
  selector: 'mat-libreta-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {

	profile: any = false;
	status: string;
	reHire: boolean;
	progress: string = '20';
	progressStyle: string = 'width: 20%;';
	progressColor: string = 'bg-primary';
	comments = new FormControl('');
	saveDisable: boolean = true;
  constructor(
		private router: Router,
		private commonService: CommonService,
		private jobsService: JobsService
	) {
		if(this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.data) {
			this.profile = this.router.getCurrentNavigation().extras.state.data;
			this.status = this.profile.status[0].status;
			this.reHire = this.profile.reHire;
		}
	}

  ngOnInit(): void {
		this.commonService.displayLog('profile',this.profile);
		if(!this.profile) {
			Swal.fire({
				type: 'warning',
				text: 'El candidato seleccionado no existe'
			});
			this.router.navigate(['/jobs']);
		}
		if(this.status === 'Rechazado') {
			this.progress = '100';
			this.progressStyle = 'width: 100%;';
			this.progressColor = 'bg-danger';
		}
		if(this.status === 'Contratado') {
			this.progress = '100';
			this.progressStyle = 'width: 100%;';
			this.progressColor = 'bg-success';
		}
		if(this.status === 'Relevante') {
			this.progress = '40';
			this.progressStyle = 'width: 40%;';
			this.progressColor = 'bg-warning';
		}
		if(this.status === 'Entrevista'){
			this.progress = '60';
			this.progressStyle = 'width: 60%;';
			this.progressColor = 'bg-warning';
		}
		if(this.status === 'Propuesta'){
			this.progress = '80';
			this.progressStyle = 'width: 80%;';
			this.progressColor = 'bg-success';
		}
		this.comments.valueChanges.subscribe(() => {
			if(this.saveDisable = true) {
				this.saveDisable = false;
			}
		});
  }

	relevante() {
		this.status = 'Relevante';
		this.progress = '40';
		this.progressStyle = 'width: 40%;';
		this.progressColor = 'bg-warning';
		this.comments.setValidators([Validators.required]);
		this.comments.updateValueAndValidity();
		this.comments.markAsDirty();
		this.saveDisable = false;
		Swal.fire({
			text: 'Por favor indica en el campo de comentarios, por qué motivo este candidato es relevante'
		});
	}

	entrevista() {
		this.status = 'Entrevista';
		this.progress = '60';
		this.progressStyle = 'width: 60%;';
		this.progressColor = 'bg-warning';
		this.comments.setValidators([Validators.required]);
		this.comments.updateValueAndValidity();
		this.comments.markAsDirty();
		Swal.fire({
			text: 'Por favor indica en el campo de comentarios, indica los detalles de la entrevista (fecha, hora y medio de contacto)'
		});
		this.saveDisable = false;
	}

	propuesta() {
		this.status = 'Propuesta';
		this.progress = '80';
		this.progressStyle = 'width: 80%;';
		this.progressColor = 'bg-success';
		this.comments.setValidators([Validators.required]);
		this.comments.updateValueAndValidity();
		this.comments.markAsDirty();
		Swal.fire({
			text: 'Por favor indica en el campo de comentarios, cuál es la propuesta para el candidato'
		});
		this.saveDisable = false;
	}

	contratar() {
		this.status = 'Contratado';
		this.progress = '100';
		this.progressStyle = 'width: 100%;';
		this.progressColor = 'bg-success';
		this.comments.setValidators([Validators.required]);
		this.comments.updateValueAndValidity();
		this.comments.markAsDirty();
		Swal.fire({
			text: 'Por favor indica en el campo de comentarios, por qué motivo no debe contratarse a este candidato'
		});
		this.saveDisable = false;
	}

	noAcepta() {
		this.status = 'No acepta';
		this.progress = '100';
		this.progressStyle = 'width: 100%;';
		this.progressColor = 'bg-danger';
		this.comments.setValue('No aceptó propuesta');
		// this.comments.setValidators([Validators.required]);
		// this.comments.updateValueAndValidity();
		// this.comments.markAsDirty();
		// Swal.fire({
		// 	text: 'Si lo deseas puedes dejar un comentario'
		// });
		this.saveDisable = false;
	}

	rechazar() {
		this.status = 'Rechazado';
		this.progress = '100';
		this.progressStyle = 'width: 100%;';
		this.progressColor = 'bg-danger';
		this.comments.setValidators([Validators.required]);
		this.comments.updateValueAndValidity();
		this.comments.markAsDirty();
		Swal.fire({
			text: 'Por favor, indica el motivo del rechazo en el campo de comentarios'
		});
		this.saveDisable = false;
	}

	noContratar() {
		this.status = 'Rechazado';
		this.progress = '100';
		this.progressStyle = 'width: 100%;';
		this.progressColor = 'bg-danger';
		this.reHire = false;
		this.comments.setValidators([Validators.required]);
		this.comments.updateValueAndValidity();
		this.comments.markAsDirty();
		Swal.fire({
			text: 'Por favor indica en el campo de comentarios, por qué motivo no debería contratarse a este candidato'
		});
		this.saveDisable = false;
	}

	modifyCV() {
		if(this.comments.valid) {
			const sendForm = {
				comments: this.comments.value,
				status: this.status,
				reHire: this.reHire
			}
			this.commonService.displayLog('sendForm',sendForm);
			Swal.fire('Espera...');
			Swal.showLoading();
			this.jobsService.modifyCV(sendForm,this.profile._id).subscribe(data => {
				Swal.hideLoading();
				Swal.close();
				if(data && data.message && data.message.includes('Cambios guardados')) {
					Swal.fire({
						type: 'success',
						text: data.message
					});
				} else {
					Swal.fire({
						type: 'warning',
						text: data.message
					});
				}
				this.close();
			}, error => {
				Swal.fire({
					type: 'error',
					text: `Hubo un error: ${error.message}`
				});
				Swal.hideLoading();
				Swal.close();
				console.log(error);
			})
		} else {
			Swal.fire({
				type: 'warning',
				text: 'Debes agregar un comentario'
			});
		}
	}

 	close() {
		this.router.navigate(['/jobs']);
	}

}
