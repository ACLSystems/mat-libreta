import { Injectable } from '@angular/core';

import { Identity } from '@cetecshared/types/user.type';
import { environment } from '@cetecenv/environment';

@Injectable()
export class CommonService {

	public url: string;
	public identity: Identity;
	public token: string;
	public tokenVersion: string;
	public roles: any;

	constructor() {
		this.url = environment.url;
	}

	/*
	metodo para traer la identidad del usuario autenticado
	*/
	getidentity() {
		const identity = JSON.parse(localStorage.getItem('identity'));
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
		localStorage.setItem('identity',JSON.stringify(data));
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
		const token = localStorage.getItem('token');
		if (token !== 'undefined') {
			this.token = token;
		} else {
			this.token = null;
		}
		return this.token;
	}
}
