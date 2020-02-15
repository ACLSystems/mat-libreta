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
		this.url = this.commonService.getEnvironment().url;
	}

	/*
	metodo login
	*/
	login(username: string, password: string): Observable<any> {
		const body = JSON.stringify({username,password});
		const route = this.url + 'login';
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
