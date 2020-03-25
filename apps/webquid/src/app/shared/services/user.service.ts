import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SimpleGlobal } from 'ng2-simple-global';

import { Identity } from '@wqshared/types/user.type';
import { Publicity } from '@wqshared/types/publicity.type';

import { CommonService } from '@wqshared/services/common.service';
import { JSONHeaders } from '@mat-libreta/shared';
import { environment } from '@wqenv/environment';

//permitimos con este decorador inyectar a otras dependencias
@Injectable()
export class UserService{

	public url: string;
	public identity: Identity;
	public token: any;
	public tokenVersion: string;
	public roles: any;


	constructor(
		private http: HttpClient,
		private commonService: CommonService,
		private sg: SimpleGlobal
	) {
		this.url = environment.url;
	}

	/*
	metodo para traer la identidad del usuario autenticado
	*/
	getidentity(): Identity {
		return this.commonService.getidentity();
		// const identity = JSON.parse(localStorage.getItem('identity'));
		// if (identity !== 'undefined') {
		// 	this.identity = identity;
		// } else {
		// 	this.identity = null;
		// }
		// return this.identity;
	}

	/*
	metodo para poner el token del usuario logueado donde el api lo requiera
	*/
	getToken() {
		return this.commonService.getToken();
		// const token = localStorage.getItem('token');
		// if (token !== 'undefined') {
		// 	this.token = token;
		// } else {
		// 	this.token = null;
		// }
		// return this.token;
	}

	/*
	metodo para refrescar el token del usuario
	*/

	refreshToken(): Observable<any>|null {
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/refreshtoken';
		return this.http.post(route, {}, {headers});
	}

	updateIdentity(identity: Identity): Identity {
		return this.commonService.updateIdentity(identity);
	}

	/*
	método para eliminar datos de la sesión
	*/
	destroySession() {
		delete this.sg['identity'];
		delete this.sg['token'];
		delete this.sg['tokenVersion'];
		// localStorage.removeItem('identity');
		// localStorage.removeItem('token');
		// localStorage.removeItem('tokenVersion');
		// localStorage.clear();
		return;
	}

	/*
	metodo para poner el token del usuario logueado donde el api lo requiera
	*/
	getTokenVersion() {
		const tokenVersion = this.sg['tokenVersion'];
		// const tokenVersion = localStorage.getItem('tokenVersion');
		if (tokenVersion !== 'undefined') {
			this.tokenVersion = this.tokenVersion;
		} else {
			this.tokenVersion = null;
		}
		return this.tokenVersion;
	}

	getMyPublicity(): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = this.url + 'api/v1/mypublicity';
			return this.http.get(route, httpOptions);
		} else {
			return null
		}
	}

	getMyServices(): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = this.url + 'api/v1/myservices';
			return this.http.get(route, httpOptions);
		} else {
			return null
		}
	}

	getService(serviceid:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = this.url + 'api/v1/service/' + serviceid;
			return this.http.get(route, httpOptions);
		} else {
			return null
		}
	}

	getCompanies(): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = this.url + 'api/v1/operator/company';
			return this.http.get(route, httpOptions);
		} else {
			return null
		}
	}

	createPublicity(body:Publicity): Observable<any>|null {
		const params = JSON.stringify(body);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/publicity';
		return this.http.post(route, params, {headers});
	}
}
