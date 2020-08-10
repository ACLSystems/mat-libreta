import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

declare const $:any;

import {
	PublicService,
	CommonService
} from '@mat-libreta/shared';
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

	recoverForm = this.fb.group({
		username: ['', [
				Validators.required,
				Validators.email,
				Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]
		]
	});
	useRegister: boolean = false;
	recoveryCode: boolean = false;
	code: string = '';
	digitsCount: number = 0;

	constructor(
		private publicService: PublicService,
		private recoverPass: RecoverPassService,
		private commonService: CommonService,
		private fb: FormBuilder,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.route.params.subscribe(params => {
			if(params.code) this.code = params.code;
			if(params.username) this.recoverForm.get('username').setValue(params.username);
			if(this.code && this.username.value) this.sendCode();
			this.commonService.displayLog('Code',this.code);
			this.commonService.displayLog('UserName', this.username.value);
		});
	}

	ngOnInit() {
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
		if(this.code !== '') {
			this.sendCode();
			return;
		}
		this.validateAllFormFields(this.recoverForm);
		if(!this.recoverForm.valid) {
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los errores',
				timer: 2000,
				showConfirmButton: false
			});
		}
			Swal.fire('Solicitando acceso. Espera...');
			Swal.showLoading();
			const username = this.recoverForm.get('username').value.toLowerCase();
			this.publicService.getUserDetails(username).subscribe(data => {
				// console.log(data);
				if(data && data.message && data.message == `Usuario -${username}- no existe`) {
					Swal.fire({
						type: 'warning',
						html: `El usuario <b>${username}</b> no está registrado.`
					});
					// this.recoverForm.reset();
					this.useRegister = true;
					return;
				}
				if(data && data.user && data.user.email === username){
					this.recoverPass.requestPassRecovery(username).subscribe(data => {
						// console.log(data);
						if(data && data.message && data.message === 'Email encontrado') {
							Swal.hideLoading();
							Swal.close();
							// Swal.fire({
							// 	type: 'info',
							// 	html: `En los siguientes minutos te llegará un correo a la cuenta <br><b>${username}</b><br>Revisa ese correo e ingresa los números que te proporcionamos.<br>Nota: Busca en la carpeta de "No deseados" si este correo no llegara en los próximos minutos`
							// });
							// this.recoverForm.reset();
							this.recoveryCode = true;
							setTimeout(() => {
								const input0 = document.getElementById('input-0');
								console.log(input0);
								if(input0) input0.focus();
							}, 261);
						}
					}, error => {
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'error',
							html: `Ocurrió un error: ${error}`
						});
					});
				}
			}, error => {
				Swal.hideLoading();
				Swal.close();
				console.log(error);
				Swal.fire({
					type: 'error',
					html: `Ocurrió un error: ${error}`
				});
			});
	}

	sendCode() {
		Swal.fire('Espera...');
		Swal.showLoading();
		this.publicService.recoverPass({
			email: this.username.value,
			emailID: this.code
		}).subscribe(data => {
			Swal.hideLoading();
			Swal.close();
			if(data.message && data.message.includes('no existe')) {
				Swal.fire({
					type: 'warning',
					text: data.message
				})
				return;
			}
			if(data.message && data.message.includes('Usuario no ha solicitado recuperación de acceso')) {
				Swal.fire({
					type: 'warning',
					text: data.message
				})
				return;
			}
			if(data.message && data.message.includes('Token no válido')) {
				Swal.fire({
					type: 'warning',
					text: 'Código no válido'
				})
				return;
			}
			const token = data.token;
			localStorage.setItem('token', token);
			let decodedToken = this.getDecodedAccessToken(token);
			let roles = data.roles ? {
				isAdmin: data.roles.isAdmin || false,
				isBusines: data.roles.isBusines || false,
				isOrg: data.roles.isOrg || false,
				isOrgContent: data.roles.isOrgContent || false,
				isAuthor: data.roles.isAuthor || false,
				isSupervisor: data.roles.isSupervisor || false,
				isInstructor: data.roles.isInstructor ||false,
				isRequester: data.roles.isRequester ||false,
				isMoocSupervisor: data.roles.isMoocSupervisor || false,
				isUser: data.roles.isUser ||false
			} : {
				isAdmin: false,
				isBusines: false,
				isOrg: false,
				isOrgContent: false,
				isAuthor: false,
				isSupervisor: false,
				isInstructor: false,
				isRequester: false,
				isMoocSupervisor: false,
				isUser: false
			}
			localStorage.setItem('identity', JSON.stringify({
				admin: decodedToken.admin,
				attachedToWShift: decodedToken.attachedToWShift,
				name: decodedToken.sub,
				// org: decodedToken.org.name,
				// orgUnit: decodedToken.orgUnit.name,
				orgid: decodedToken.org,
				ouid: decodedToken.orgUnit,
				person: decodedToken.person,
				preferences: decodedToken.preferences,
				userid: decodedToken.userid
			}));
			localStorage.setItem('roles',JSON.stringify(roles));
			this.router.navigate(['/dashboard']);
		}, error => {
			Swal.hideLoading();
			Swal.close();
			this.resetFields();
			console.log(error);
			Swal.fire({
				type: 'error',
				html: `Ocurrió un error: ${error}`
			});
		})
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

	resetFields() {
		$('#input-0').val('');
		$('#input-1').val('');
		$('#input-2').val('');
		$('#input-3').val('');
		$('#input-4').val('');
		$('#input-0').focus();
		$('#input-5').val('');
		this.code = '';
		this.digitsCount = 0;
	}

	addNumbers(event:any) {
		console.log(event);
		if(this.digitsCount === 6) {
			this.resetFields();
			return;
		}
		const key = event.key;
		const regex = /[0-9]/g
		if(!key.match(regex)) {
			Swal.fire({
				type: 'warning',
				text: 'Solo ingresa números'
			});
			return;
		}
		const next = event.target.nextElementSibling;
		this.code += event.key;
		this.digitsCount ++;
		console.log(this.code);
		console.log(this.digitsCount);
		if(this.digitsCount < 6 && next) {
			next.focus()
		}
		return;
	}

	goRegister() {
		this.router.navigate(['/pages/register']);
	}

	getDecodedAccessToken(token: string): any {
		try {
			return jwt_decode(token);
		} catch (err)  {
			return null;
		}
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
