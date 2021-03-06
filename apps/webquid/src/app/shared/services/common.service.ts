import { Injectable } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';

import { Identity } from '@wqshared/types/user.type';
import { environment } from '@crmenv/environment';

@Injectable()
export class CommonService {

	public url: string;
	public identity: Identity;
	public token: string;
	public tokenVersion: string;
	public roles: any;

	constructor(
		private sg: SimpleGlobal
	) {
		this.url = environment.url;
	}

	/*
	metodo para traer la identidad del usuario autenticado
	*/
	getidentity(): Identity {
		// const identity = JSON.parse(localStorage.getItem('identity'));
		const keys = Object.keys(this.sg);
		if(keys.length === 0) {
			return null;
		}
		if(!keys.includes('identity')){
			return null;
		};
		const identity = JSON.parse(this.sg['identity']);
		if (identity !== 'undefined') {
			this.identity = identity;
		} else {
			this.identity = null;
		}
		return this.identity;
	}

	/*
	metodo para traer la identidad del usuario autenticado
	*/
	updateIdentity(data: Identity) {
		// localStorage.setItem('identity',JSON.stringify(data));
		this.sg['identity'] = JSON.stringify(data);
		var identity = JSON.parse(localStorage.getItem('identity'));
		if (identity !== 'undefined') {
			this.identity = identity;
		} else {
			this.identity = null;
		}
		return this.identity;
	}

	/*
	metodo para poner el token del usuario logueado donde el api lo requiera
	*/
	getToken() {
		// const token = localStorage.getItem('token');
		const keys = Object.keys(this.sg);
		if(keys.length === 0) {
			return null;
		}
		if(!keys.includes('token')){
			return null;
		};
		const token = this.sg['token'];
		if (token !== 'undefined') {
			this.token = token;
		} else {
			this.token = null;
		}
		return this.token;
	}

	/*
	Método para desplegar logs en consola.
	*/
	displayLog(display:string, obj: any) {
		console.group(display);
		console.log(obj);
		console.groupEnd();
	}
}
