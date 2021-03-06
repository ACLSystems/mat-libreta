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

	test(): Observable<any>|null {
		const route = this.url + 'api/test';
		return this.http.get(route);
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
		}
		return null;
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
		}
		return null;
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
		}
		return null;
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
		}
		return null;
	}

	createPublicity(body:Publicity): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const params = JSON.stringify(body);
			const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
			const route = this.url+'api/v1/publicity';
			return this.http.post(route, params, {headers});
		}
		return null;
	}

	searchDocuments(params:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = `${this.url}api/v1/attachment?${params}`;
			return this.http.get(route, httpOptions);
		}
		return null;
	}

	searchMyDocuments(params:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = `${this.url}api/v1/myattachments?${params}`;
			return this.http.get(route, httpOptions);
		}
		return null;
	}

	getDocument(docid:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = `${this.url}api/v1/attachment/${docid}`;
			return this.http.get(route, httpOptions);
		}
		return null;
	}

	createServiceRequest(method:string,api:string,data:any): Observable<any>| null {
		const token = this.getToken();
		if(token) {
			const params = {
				method,
				api,
				data
			}
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = `${this.url}api/v1/request`;
			return this.http.post(route, params, httpOptions);
		}
		return null;
	}

	createVacations(data: any): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			}
			const route = `${this.url}api/v1/vacation`;
			return this.http.post(route, data, httpOptions);
		}
		return null;
	}

	getMyDetails() : Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			}
			const route = `${this.url}api/v1/user`;
			return this.http.get(route,httpOptions);
		}
		return null;
	}

	newPass(oldPass:string, newPass:string): Observable<any>| null {
		const token = this.getToken();
		if(token) {
			const params = {
				password: oldPass,
				newpass: newPass
			}
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = `${this.url}api/v1/newpass`;
			return this.http.patch(route, params, httpOptions);
		}
		return null;
	}

	confirmEmail(email:string, validationString:string): Observable<any>| null {
		const params = {
			email,
			validationString
		}
		const route = `${this.url}api/user/confirmEmail`;
		return this.http.patch(route, params, {headers:JSONHeaders});
		return null;
	}


	addEmail(email:string): Observable<any>| null {
		const token = this.getToken();
		if(token) {
			const params = {
				email
			}
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = `${this.url}api/v1/user/addemail`;
			return this.http.patch(route, params, httpOptions);
		}
		return null;
	}

	getMyRequests(all?:boolean): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = all ? `${this.url}api/v1/requests?status=all` : `${this.url}api/v1/requests`;
			return this.http.get(route, httpOptions);
		}
		return null;
	}

	refreshRequest(ticketid:string,): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = `${this.url}api/v1/request/${ticketid}/refresh`;
			return this.http.get(route, httpOptions);
		}
		return null;
	}

	reply(ticketid: string, body:string, cc_emails?:any): Observable<any>| null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const data = cc_emails ? {
				body,
				cc_emails
			} : {
				body
			}
			const route = `${this.url}api/v1/reply/${ticketid}`;
			return this.http.post(route,data,httpOptions);
		}
		return null;
	}
}
