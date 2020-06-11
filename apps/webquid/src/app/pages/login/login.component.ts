import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { SimpleGlobal } from 'ng2-simple-global';
import Swal from 'sweetalert2';

import { Identity } from '@wqshared/types/user.type';

import { UserService } from '@wqshared/services/user.service';
import { PublicService } from '@wqshared/services/public.service';
// import { Login } from './login';

import { environment } from '@wqenv/environment';

@Component({
	selector: 'webquid-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [UserService]
})
export class LoginComponent implements OnInit {

	// RFCRegex = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
	type = 'password';
	dataIsOk = false;
	loading = false;
	messageSuccess: string;
	messageError: string;
	messageErroremail: string;
	token: any;
	tokenVersion: string;
	identity: Identity | null;
	show = false;
	loginForm = this.fb.group({
		identifier: ['', [
			Validators.required,
			mustBeValidRFC
		]],
		password: ['', [
			Validators.required
		]]
	});

	constructor(
		private router: Router,
		private userService: UserService,
		private publicService: PublicService,
		private sg: SimpleGlobal,
		private fb: FormBuilder
	) {

	}

	get identifier() {
		return this.loginForm.get('identifier');
	}

	get password() {
		return this.loginForm.get('password');
	}

	ngOnInit() {
		if(!this.tokenVersion) {
			this.userService.destroySession();
		}
		// const card = document.getElementsByClassName('card')[0];
		// setTimeout(function() {
		// 		// after 1000 ms we add the class animated to the login/register card
		// 		card.classList.remove('card-hidden');
		// }, 700);
	}

	rfcUpper() {
		let identifier = this.loginForm.get('identifier');
		identifier.setValue(identifier.value.toUpperCase());
	}

	getCredentials(){
		if(this.loginForm.valid) {
			this.dataIsOk = true;
		} else {
			this.dataIsOk = false;
		}
	}

	getlogin() {
		this.loading = true;
		this.messageError= null;
		this.publicService
			.login(this.loginForm.get('identifier').value, this.loginForm.get('password').value)
			.subscribe(data => {
				this.token = data.token;
				this.sg['token'] = this.token;
				this.sg['tokenVersion'] = environment.tokenVersion;
				this.sg['tokenExp'] = data.exp;
				let decodedToken = this.getDecodedAccessToken(this.token);
				this.identity = {
					identifier: decodedToken.sub,
					companies: decodedToken.companies,
					person: decodedToken.person,
					userid: decodedToken.userid,
					roles: data.roles
				};
				const portalVersion = +data.portalVersion;
				const lsPortalVersion = +localStorage.getItem('wq.portalVersion') || portalVersion;
				if(!localStorage.getItem('wq.portalVersion')) {
					localStorage.setItem('wq.portalVersion',portalVersion+'');
				}
				if(portalVersion > lsPortalVersion) {
					Swal.fire({
						type: 'info',
						html: 'Hay una nueva version de la aplicación. <br>¿Deseas actualizar?',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Recargar la página'
					}).then((result) => {
						if(result.value) {
							localStorage.setItem('wq.portalVersion',portalVersion+'');
							window.location.reload(true);
						}
					});
				}
				this.sg['identity'] = JSON.stringify(this.identity);
				this.router.navigate(['/services']);
				this.loading = false;
		}, error => {
			console.log(error)
			if ( error.status > 399 && error.status < 500) {
				this.messageError = 'En caso de que no recuerdes tu contraseña <br>selecciona la opción <b style="color:blue;">Recuperar Acceso</b>';
				Swal.fire({
					title: 'Usuario o contraseña no válidos',
					html: this.messageError,
					type: 'error',
					confirmButtonText: 'Ok',
					confirmButtonClass: 'btn btn-danger'
				});
			} else if(error.status === 0 || (error.message && error.message.includes('failure response'))) {
				this.messageError = 'Espera unos minutos e intenta nuevamente. Si persiste el error después de varios intentos, favor de reportarlo a la mesa de ayuda. Error: ' + error.status;
				Swal.fire({
					title: 'El servicio no está disponible',
					text: this.messageError,
					type: 'error',
					confirmButtonText: 'Ok',
					confirmButtonClass: 'btn btn-danger'
				});
			} else {
				// this.messageError = 'Favor de reportarlo a la mesa de ayuda, estatus:' + error.status;
				// Swal.fire({
				// 	title: 'Ocurrió un error interno de sistema',
				// 	text: this.messageError,
				// 	type: 'error',
				// 	confirmButtonText: 'Ok',
				// 	confirmButtonClass: 'btn btn-danger'
				// });
			}
			this.loading = false;
		});
	}

	showPass() {
		this.show = !this.show;
		if (this.show) {
			this.type = 'text';
		} else {
			this.type = 'password';
		}
	}

	getDecodedAccessToken(token: string): any {
		try {
			return jwt_decode(token);
		} catch (err)  {
			return null;
		}
	}

}

function mustBeValidRFC(field: FormControl) {
	let RFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
	let value = field.value;
	if(value === '') {
		return null;
	}
	value = value.toUpperCase();
	return RFC.test(value) ? null : {
		validateEmail: {
			valid: false
		}
	}
}
