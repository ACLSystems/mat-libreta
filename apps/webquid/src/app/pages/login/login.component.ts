import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { SimpleGlobal } from 'ng2-simple-global';
import Swal from 'sweetalert2';

import { Identity } from '@wqshared/types/user.type';

import { UserService } from '@wqshared/services/user.service';
import { PublicService } from '@wqshared/services/public.service';
import { Login } from './login';

import { environment } from '@wqenv/environment';

@Component({
	selector: 'webquid-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [UserService]
})
export class LoginComponent implements OnInit {

	RFCRegex = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
	type = 'password';
	dataIsOk = false;
	loading = false;
	messageSuccess: string;
	messageError: string;
	messageErroremail: string;
	login: Login;
	token: any;
	tokenVersion: string;
	identity: Identity | null;
	show = false;

	constructor(
		private router: Router,
		private userService: UserService,
		private publicService: PublicService,
		private sg: SimpleGlobal
	) {
		this.login = new Login('', '');
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

	getCredentials(){
		if (this.RFCRegex.test(this.login.username)) {
			this.messageErroremail = null;
		} else {
			this.messageErroremail = 'Proporciona un RFC válido';
		}
		if (this.login.username !== '' && this.login.password !== '' && this.RFCRegex.test(this.login.username)) {
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
