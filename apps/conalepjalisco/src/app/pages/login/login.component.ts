import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

import { Identity, UserService, PublicService, CommonService } from '@mat-libreta/shared';
import { environment } from '@cjaenv/environment';

import { Login } from './login';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [UserService]
})
export class LoginComponent implements OnInit {

	emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	type = 'password';
	dataIsOk = false;
	loading = false;
	messageSuccess: string;
	messageError: string;
	messageErroremail: string;
	login: Login;
	token: any;
	tokenVersion: string;
	identity: Identity;
	show = false;

	constructor(
		private router: Router,
		private userService: UserService,
		private publicService: PublicService,
		private commonService: CommonService
	) {
		this.login = new Login('', '');
	}

	ngOnInit() {
		this.token = this.userService.getToken();
		this.identity = this.userService.getidentity();
		this.tokenVersion = this.userService.getTokenVersion();
		if(!this.tokenVersion) {
			this.userService.destroySession();
			this.commonService.setEnvironment({
				instanceName: environment.instanceName,
				url: environment.url,
				footerName: environment.footerName,
				footerLink: environment.footerLink,
				colorEvents: environment.colorEvents
			});
		}
		const card = document.getElementsByClassName('card')[0];
		setTimeout(function() {
				// after 1000 ms we add the class animated to the login/register card
				card.classList.remove('card-hidden');
		}, 700);
	}

	getCredentials(){
		if (this.emailRegex.test(this.login.username)) {
			this.messageErroremail = null;
		} else {
			this.messageErroremail = 'Proporciona una dirección de correo válida (<cuenta>@<dominio>.<raiz>)';
		}
		if (this.login.username !== '' && this.login.password !== '' && this.emailRegex.test(this.login.username)) {
			this.dataIsOk = true;
		} else {
			this.dataIsOk = false;
		}
	}

	getlogin() {
		this.loading = true;
		this.messageError= null;
		this.publicService
			.login(this.login.username, this.login.password)
			.subscribe(data => {
				this.token = data.token;
				localStorage.setItem('token', this.token);
				localStorage.setItem('tokenVersion', '2');
				let decodedToken = this.getDecodedAccessToken(this.token);
				localStorage.setItem('identity', JSON.stringify({
					admin: decodedToken.admin,
					attachedToWShift: decodedToken.attachedToWShift,
					name: decodedToken.sub,
					org: decodedToken.org.name,
					orgUnit: decodedToken.orgUnit.name,
					orgid: decodedToken.org._id,
					ouid: decodedToken.orgUnit._id,
					person: decodedToken.person,
					preferences: decodedToken.preferences,
					userid: decodedToken.userid
				}));
				this.router.navigate(['/dashboard']);
				this.loading = false;
		}, error => {
			if ( error.status > 399 && error.status < 500) {
				this.messageError = 'En caso de que no recuerdes tu contraseña <br>selecciona la opción <b style="color:blue;">Recuperar Acceso</b>';
				Swal.fire({
					title: 'Usuario o contraseña no válidos',
					html: this.messageError,
					type: 'error',
					confirmButtonText: 'Ok',
					confirmButtonClass: 'btn btn-danger'
				});
			} else {
				this.messageError = 'Favor de reportarlo a la mesa de ayuda, estatus:' + error.status;
				Swal.fire({
					title: 'Ocurrió un error interno de sistema',
					text: this.messageError,
					type: 'error',
					confirmButtonText: 'Ok',
					confirmButtonClass: 'btn btn-danger'
				});
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
