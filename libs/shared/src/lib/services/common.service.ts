import { Injectable } from '@angular/core';

import { Identity } from '../types/user.type';
import { Environment } from '../types/env.type';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	environment : Environment;
	identity		: Identity;
	token				: string;
	tokenVersion: string;
	roles				: any;

	constructor() {}

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

	/*
	metodo para extraer el nombre de la instancia (instanceName)
	*/
	getEnvironment() {
		const environment = localStorage.getItem('environment');
		if(environment !== 'undefined') {
			this.environment = JSON.parse(environment);
		} else {
			this.environment = null;
		}
		return this.environment;
	}

	/*
	metodo para setear el url del api
	*/
	setEnvironment(environment: Environment) {
		localStorage.setItem('environment',JSON.stringify(environment));
	}

 }
