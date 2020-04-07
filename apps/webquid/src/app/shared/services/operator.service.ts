import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin} from 'rxjs';
import { SimpleGlobal } from 'ng2-simple-global';

import { Identity } from '@wqshared/types/user.type';
import { Publicity } from '@wqshared/types/publicity.type';

import { CommonService } from '@wqshared/services/common.service';
import { JSONHeaders } from '@mat-libreta/shared';
import { environment } from '@wqenv/environment';

//permitimos con este decorador inyectar a otras dependencias
@Injectable()
export class OperatorService{

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

	sendCFDI(file:any): Observable<any>|null {
		const params = JSON.stringify(file);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/cfdi';
		return this.http.post(route, params, {headers});
	}

	sendSeveralCFDI(files:any): Observable<any>|Observable<any>[]|null {
		let token = this.getToken();
		let allQueries = files.map(file => {
			let params = JSON.stringify(file);
			let headers = JSONHeaders.set(
				'Authorization', `Bearer ${token}`
			)
			let route = `${this.url}api/v1/cfdi`
			return this.http.post(route, params, {headers});
		});
		return forkJoin(allQueries);
	}

}
