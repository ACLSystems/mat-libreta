import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as jwt_decode from 'jwt-decode';
import { SimpleGlobal } from 'ng2-simple-global';
import Swal from 'sweetalert2';

import {
	Identity,
	UserService,
	PublicService,
	CommonService
} from '@mat-libreta/shared';
import { EnvService } from '@cjashared/services/setEnv.service';

// import { Login } from './login';

@Component({
	selector: 'cja-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [UserService]
})
export class LoginComponent implements OnInit {

	// emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	type = 'password';
	dataIsOk = false;
	loading = false;
	messageSuccess: string;
	messageError: string;
	messageErroremail: string;
	// login: Login;
	token: any;
	tokenVersion: string;
	identity: Identity;
	show = false;
	loginForm = this.fb.group({
		username: ['', [
			Validators.required,
			mustBeValidEmail
		]],
		password: ['', [
			Validators.required
		]]
	});
	mooc: boolean = false;
	errors = {
		auth: false
	}

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userService: UserService,
		private publicService: PublicService,
		private envService: EnvService,
		private fb: FormBuilder,
		private sg: SimpleGlobal,
		private commonService: CommonService
	) {
		const instance = this.sg['instance'];
		if(instance?.platform.type === 'mooc') this.mooc = true;
		this.activatedRoute.queryParams.subscribe(params => {
			console.log('Login... viene de error',params['error']);
			if(params['error'] && params['error'] === '401') {
				this.errors.auth = true;
			}
		})
	}

	get username() {
		return this.loginForm.get('username');
	}

	get password() {
		return this.loginForm.get('password');
	}

	ngOnInit() {
		if(this.errors.auth) {
			this.userService.destroySession();
			this.envService.setEnvironment();
			this.errors.auth = false;
		} else {
			this.token = this.userService.getToken();
			this.identity = this.userService.getidentity();
			if(!this.token || !this.identity) {
				this.userService.destroySession();
				this.envService.setEnvironment();
			}
			if(this.token && this.identity) {
				this.router.navigate(['/dashboard']);
			}
		}


		// const card = document.getElementsByClassName('card')[0];
		// setTimeout(function() {
		// 		// after 1000 ms we add the class animated to the login/register card
		// 		card.classList.remove('card-hidden');
		// }, 700);
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
			.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
			.subscribe(data => {
				this.token = data.token;
				localStorage.setItem('token', this.token);
				let decodedToken = this.getDecodedAccessToken(this.token);
				if(!decodedToken.org.name || !decodedToken.orgUnit.name) {
					this.userService.logoutAll().subscribe(() => {
						this.router.navigate(['/pages/logout']);
					}, error => {
						console.log(error);
						this.router.navigate(['/pages/home']);
					});
				}
				this.commonService.displayLog('Decoded Token',decodedToken);
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
				this.userService.getRolesHTTP().subscribe(data => {
					// console.log(data);
					let roles = data.message ? {
						isAdmin: data.message.isAdmin || false,
						isBusines: data.message.isBusines || false,
						isOrg: data.message.isOrg || false,
						isOrgContent: data.message.isOrgContent || false,
						isAuthor: data.message.isAuthor || false,
						isSupervisor: data.message.isSupervisor || false,
						isInstructor: data.message.isInstructor ||false,
						isRequester: data.message.isRequester ||false,
						isMoocSupervisor: data.message.isMoocSupervisor || false,
						isUser: data.message.isUser ||false
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
					localStorage.setItem('roles',JSON.stringify(roles));
					this.router.navigate(['/dashboard']);
					this.loading = false;
				});
		}, error => {
			// console.group('Estoy en login');
			// console.log(error);
			// console.groupEnd();
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
				var title = 'Ocurrió un error interno de sistema';
				if(typeof error === 'string') {
					this.messageError = error;
					title = 'Datos incorrectos, por favor revisa'
				} else {
					this.messageError = 'Favor de reportarlo a la mesa de ayuda, estatus:' + error.status;
				}
				Swal.fire({
					title: title,
					html: this.messageError,
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

	toLowerCase(key: string) {
		let value = this.loginForm.get(key).value.toLowerCase();
		this.loginForm.get(key).setValue(value);
	}

}

function mustBeValidEmail(field: FormControl) {
	let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	let value = field.value;
	if(value === '') {
		return null;
	}
	value = value.toUpperCase();
	return emailRegex.test(value) ? null : {
		validateEmail: {
			valid: false
		}
	}
}
