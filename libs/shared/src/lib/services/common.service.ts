import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SimpleGlobal } from 'ng2-simple-global';
import { Identity } from '../types/user.type';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	private storageEnvironment = new Subject<string>();

	getCurrentEnvironment = this.storageEnvironment.asObservable();

	sendCurrentEnvironment(message:string) {
		this.storageEnvironment.next(message);
	}

	constructor(
		private sg: SimpleGlobal
	) {}

	/*
	metodo para traer la identidad del usuario autenticado
	*/
	getidentity() {
		var identity = JSON.parse(localStorage.getItem('identity'));
		if (identity !== 'undefined') return identity;
		return null;
	}

	/*
	metodo para traer la identidad del usuario autenticado
	*/
	updateIdentity(data: Identity) {
		localStorage.setItem('identity',JSON.stringify(data));
		const identity = JSON.parse(localStorage.getItem('identity'));
		if (identity !== 'undefined') return identity;
		return null;
	}

	/*
	metodo para poner el token del usuario logueado donde el api lo requiera
	*/
	getToken() {
		const token = localStorage.getItem('token');
		if (token !== 'undefined') return token;
		return null;
	}

	/*
	metodo para extraer el nombre de la instancia (instanceName)
	*/
	getEnvironment() {
		const environment = this.sg['environment'];
		if(!environment) return null;
		if(document.location.hostname === 'localhost') return environment;
		if(environment.hostname && environment.hostname !== document.location.hostname) return null;
		return environment;
	}

	/*
	metodo para setear el url del api
	*/
	setEnvironment(environment: any) {
		const lsEnvironment = localStorage.getItem('environment');
		if(lsEnvironment) localStorage.removeItem('environment');
		this.sg['environment'] = environment;
		// console.log('Guardando ambiente');
		this.sendCurrentEnvironment('Ambiente listo');
	}

	compareObjects(a:any, b:any): boolean {
		if(typeof a !== 'object' || typeof b !== 'object') {
			return false;
		}

		const keys = Object.keys(a);
		var same = true;
		for (var key of keys) {
			if(typeof a[key] === 'string' && a[key] !== b[key]) {
				same = false;
				break;
			}
			if(typeof a[key] === 'object' && Array.isArray(a[key])) {
				if(!a[key].every((e:any) => b[key].includes(e))) {
					same = false;
					break;
				}
			}
		}
		return same;
	}

	/*
	Método para desplegar logs en consola.
	*/
	displayLog(display:string, obj: any) {
		const environment = this.getEnvironment();
		if(environment && !environment.production) {
			console.group(display);
			console.log(obj);
			console.groupEnd();
		}
	}

	displayError(display:string, obj: any) {
		console.group(`Error: ${display}`);
		console.log(obj);
		console.groupEnd();
	}

 }
