import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@crmenv/environment';
import { JSONHeaders } from '@crmshared/services/httpHeaders';

@Injectable()
export class PublicService {

	public url: string;

	constructor(
		private http: HttpClient
	) {
		this.url = environment.url;
	}

	/*
	metodo login
	*/
	login(username: string, password: string): Observable<any> {
		console.log(username,password)
		const body = JSON.stringify({username,password});
		const route = this.url + 'login';
		return this.http.post(route, body, {headers: JSONHeaders});
	}

	getLanguages(): Observable<any> {
		const route = this.url+'languages';
		return this.http.get(route);
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
