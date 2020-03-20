import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

	// messageSuccess: string;
	// messageError: string;
	// dataIsOk = false;
	// pushed = false;
	// emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

	recoverForm = new FormGroup({});
	useRegister: boolean = false;

	constructor(
		private publicService: PublicService,
		private recoverPass: RecoverPassService,
		private fb: FormBuilder,
		private router: Router
	) {}

	ngOnInit() {
		this.recoverForm = this.fb.group({
			username: ['', [
					Validators.required,
					Validators.email,
					Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]
			]
		});
		// const card = document.getElementsByClassName('card')[0];
		// setTimeout(function() {
		// 		// after 1000 ms we add the class animated to the login/register card
		// 		card.classList.remove('card-hidden');
		// }, 400);
	}

	get username() {
		return this.recoverForm.get('username');
	}

	submitRequest() {
		if(this.recoverForm.valid) {
			Swal.fire('Solicitando recuperación de contraseña. Espera...');
			Swal.showLoading();
			const username = this.recoverForm.get('username').value.toLowerCase();
			this.publicService.getUserDetails(username).subscribe(data => {
				// console.log(data);
				if(data && data.message && data.message == `User -${username}- does not exist`) {
					Swal.fire({
						type: 'warning',
						html: `El usuario <b>${username}</b> no está registrado.<br>Registrate o utiliza la cuenta de correo que usaste anteriormente para registrarte`
					});
					this.recoverForm.reset();
					this.useRegister = true;
				} else if(data && data.user && data.user.email === username){
					this.recoverPass.requestPassRecovery(username).subscribe(data => {
						// console.log(data);
						if(data && data.message && data.message === 'Email found') {
							Swal.hideLoading();
							Swal.close();
							Swal.fire({
								type: 'info',
								html: `En los siguientes minutos te llegará un correo a la cuenta <br><b>${username}</b><br>Revisa ese correo y sigue las instrucciones para recuperar tu contraseña.<br>Busca en la carpeta de "No deseados" si este correo no llegara en los próximos minutos`
							});
							this.recoverForm.reset();
						}
					}, error => {
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'error',
							text: 'Ocurrió un error en la comunicación . Intenta más tarde'
						});
					});
				}
			}, error => {
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					text: 'Ocurrió un error en la comunicación . Intenta más tarde'
				});
			});
		} else {
			this.validateAllFormFields(this.recoverForm);
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los errores',
				timer: 2000,
				showConfirmButton: false
			});
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if(control instanceof FormControl) {
				control.markAsDirty({ onlySelf: true});
			} else if(control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	goRegister() {
		this.router.navigate(['/pages/register']);
	}

	// requestPasswordRecovery(username: string) {
	// 	this.publicService.getUserDetails(username).subscribe(data => {
	// 		if (data.status >= 400 && data.status <= 500) {
	// 			console.log(data)
	// 			this.messageError = 'Utiliza la cuenta de correo con la que te registraron en este sistema.';
	// 			Swal.fire({
	// 				title: 'El usuario '+ username +' no existe',
	// 				text: this.messageError,
	// 				type: 'error',
	// 				confirmButtonText: 'Ok',
	// 				confirmButtonClass: 'btn btn-danger'
	// 			});
	// 		} else {
	// 			this.recoverPass.requestPassRecovery(username).subscribe( () => {
	// 				console.log(data);
	// 				this.messageSuccess = 'Se envió un mensaje a tu correo electrónico con instrucciones para recuperar tu contraseña.';
	// 				this.pushed = true;
	// 				Swal.fire({
	// 					title: 'Solicitud exitosa',
	// 					text: this.messageSuccess,
	// 					type: 'success',
	// 					confirmButtonText: 'Ok',
	// 					confirmButtonClass: 'btn btn-success'
	// 				});
	// 			}, error => {
	// 				console.log(error);
	// 				this.messageError = 'Error del API'
	// 				Swal.fire({
	// 					title: 'Se ha generado un error inesperado',
	// 					text: this.messageError,
	// 					type: 'error',
	// 					confirmButtonText: 'Ok',
	// 					confirmButtonClass: 'btn btn-danger'
	// 				});
	// 			})
	// 		}
	// 	}, error => {
	// 		console.log(error);
	// 		Swal.fire({
	// 			title: 'Se ha generado un error inesperado',
	// 			text: this.messageError,
	// 			type: 'error',
	// 			confirmButtonText: 'Ok',
	// 			confirmButtonClass: 'btn btn-danger'
	// 		});
	// 	});
	// }
}
