import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { PublicService } from '@mat-libreta/shared';
import { RecoverPassService } from './recoverpass.service';

@Component({
	selector: 'app-recoverpass',
	templateUrl: './recoverpass.component.html',
	styleUrls: ['./recoverpass.component.scss'],
	providers: [RecoverPassService]
})
export class RecoverPassComponent implements OnInit {

	messageSuccess: string;
	messageError: string;
	dataIsOk = false;
	pushed = false;
	emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

	constructor(
		private publicService: PublicService,
		private recoverPass: RecoverPassService
	) {}

	ngOnInit() {
		const card = document.getElementsByClassName('card')[0];
		setTimeout(function() {
				// after 1000 ms we add the class animated to the login/register card
				card.classList.remove('card-hidden');
		}, 400);
	}

	getusername(username: string) {
		if (username !== '' && this.emailRegex.test(username)) {
			this.dataIsOk = true;
		} else {
			this.dataIsOk = false;
		}
	}

	requestPasswordRecovery(username: string) {
		this.publicService.getUserDetails(username).subscribe(data => {
			if (data.status >= 400 && data.status <= 500) {
				console.log(data)
				this.messageError = 'Utiliza la cuenta de correo con la que te registraron en este sistema.';
				Swal.fire({
					title: 'El usuario '+ username +' no existe',
					text: this.messageError,
					type: 'error',
					confirmButtonText: 'Ok',
					confirmButtonClass: 'btn btn-danger'
				});
			} else {
				this.recoverPass.requestPassRecovery(username).subscribe( () => {
					console.log(data);
					this.messageSuccess = 'Se envió un mensaje a tu correo electrónico con instrucciones para recuperar tu contraseña.';
					this.pushed = true;
					Swal.fire({
						title: 'Solicitud exitosa',
						text: this.messageSuccess,
						type: 'success',
						confirmButtonText: 'Ok',
						confirmButtonClass: 'btn btn-success'
					});
				}, error => {
					console.log(error);
					this.messageError = 'Error del API'
					Swal.fire({
						title: 'Se ha generado un error inesperado',
						text: this.messageError,
						type: 'error',
						confirmButtonText: 'Ok',
						confirmButtonClass: 'btn btn-danger'
					});
				})
			}
		}, error => {
			console.log(error);
			Swal.fire({
				title: 'Se ha generado un error inesperado',
				text: this.messageError,
				type: 'error',
				confirmButtonText: 'Ok',
				confirmButtonClass: 'btn btn-danger'
			});
		});
	}
}
