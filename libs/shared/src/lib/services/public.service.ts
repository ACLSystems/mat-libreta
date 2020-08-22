import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from './common.service';
import { JSONHeaders } from './httpHeaders';

@Injectable()
export class PublicService {

	public url: string;

	constructor(
		private http: HttpClient,
		private commonService: CommonService
	) {
		this.url = localStorage.getItem('url');
		// this.commonService.getCurrentEnvironment.subscribe(() => {
		// 	const environment = this.commonService.getEnvironment();
		// 	if(environment && environment.url) this.url = environment.url;
		// });
	}

	getInstance(secondaryUrl?:string) {
		const url = this.url || secondaryUrl;
		const route = (document.location.hostname.includes('localhost')) ? `${url}api/instance?hostname=conalepslp.superatemexico.com` : `${url}api/instance?hostname=${document.location.hostname}`;
		console.log(route);
		return this.http.get(route);
	}
	/*
	metodo login
	*/
	login(username: string, password: string): Observable<any> {
		// console.log('login');
		// console.log(this.url);
		if(!this.url) {
			const environment = this.commonService.getEnvironment();
			this.url = environment.url;
		}
		const body = JSON.stringify({username,password});
		const route = this.url + 'login';
		// console.log('route', route);
		return this.http.post(route, body, {headers: JSONHeaders});
	}

	/*
	metodo register
	*/
	register(register: any): Observable<any> {
		const body = JSON.stringify(register);
		const route = this.url + 'api/user';
		return this.http.post(route, body, {headers: JSONHeaders});
	}

	/*
	metodo confirm
	*/
	confirm(confirm: any): Observable<any> {
		const body = JSON.stringify(confirm);
		const route = this.url + 'api/user/confirm';
		return this.http.post(route, body, {headers: JSONHeaders});
	}


	/*
	método para extraer los datos generales del usuario
	*/
	getUserDetails(username: any): Observable<any> {
		const route = this.url+'api/user/' + username;
		return this.http.get(route);
	}

	/*
	método para solicitar la recuperación de contraseña
	*/
	recoverPass(pass:any): Observable<any> {
		let params = JSON.stringify(pass);
		const route = this.url+'api/user/passwordrecovery';
		return this.http.post(route, params, {headers: JSONHeaders});
	}

	private handleError(errorRes: HttpErrorResponse) {
		let errorMessage = 'Error desconocido';
		console.log(errorRes);
	}
}
