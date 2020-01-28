import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Identity, JSONHeaders } from '@mat-libreta/shared';

import { environment } from '@cjaenv/environment';

@Injectable()
export class PagesService {
	public url: string;
	public identity: Identity;
	public token: any;
	public roles: any;
	public org: string;

	constructor(private http: HttpClient) {
		this.url = environment.url;
		this.org = environment.instanceName;
	}

	/*
	Funcion para obtener los estados de la republica
	*/
	getStates(org: string, query: any): Observable<any> {
		const httpOptions = {
			params: new HttpParams()
				.set('org', org)
				.set('query', JSON.stringify(query))
				.set('limit', '100')
		}
		const route = this.url + 'api/orgunit/list';
		return this.http.get(route, httpOptions);
	}

	/*
	Metodo para traer los cursos de la organizacion
	*/
	getCoursesOrg(): Observable<any> {
		const httpOptions = {
			observe: 'response' as 'body',
			params: new HttpParams()
				.set('org', this.org)
		}
		const route = this.url + 'api/course/list';
		return this.http.get(route, httpOptions);
		//return this.http.get(this.url+'api/course/list?org=' + this.org, {observe: 'response'});
	}

	/*
	Metodo para mostrar el contenido del temario del curso al usuario final
	*/
	showBlocks(id: string): Observable<any> {
		const httpOptions = {
			observe: 'response' as 'body',
			params: new HttpParams()
				.set('id', id)
		}
		const route = this.url + 'api/course/getblocklist';
		return this.http.get(route, httpOptions);
		//return this.http.get(this.url + 'api/course/getblocklist?id=' + id, {observe: 'response'});
	}
	//metodo para obtener las areas de educacion
	getAreas(org: string): Observable<any> {
		const httpOptions = {
			observe: 'response' as 'body',
			params: new HttpParams()
				.set('org', org)
		}
		const route = this.url + 'api/career/listareas';
		return this.http.get(route, httpOptions);
		//return this.http.get(this.url + 'api/career/listareas?org=' + org, {observe: 'response'});
	}

	//metodo para obtener las carreras en base a area de educacion
	getCarreras(org:string, query:any):Observable<any> {
		const httpOptions = {
			observe: 'response' as 'body',
			params: new HttpParams()
				.set('org', org)
				.set('query', JSON.stringify(query))
				.set('limit', '50')
		}
		const route = this.url + 'api/career/list';
		return this.http.get(route, httpOptions);
		//return this.http.get(this.url+'api/career/list?org='+org+"&query="+json+"&limit=50",{observe:'response'});
	}

	getTerms(org:string,query:any):Observable<any> {
		const httpOptions = {
			observe: 'response' as 'body',
			params: new HttpParams()
				.set('org', org)
				.set('query', JSON.stringify(query))
				.set('limit', '50')
		}
		const route = this.url + 'api/term/list';
		return this.http.get(route, httpOptions);
		//return this.http.get(this.url+'api/term/list?org='+org+"&query="+json+"&limit=50",{observe:'response'})//.map(res=>res.json());
	}

	getCertificate(folio:number) {
		const httpOptions = {
			params: new HttpParams()
				.set('certificate', ''+folio)
		}
		const route = this.url + 'api/cert/get';
		return this.http.get(route, httpOptions);
		//return this.http.get(this.url+'api/cert/get?certificate='+folio);
	}

	captcha(response:string) {
		let body = {response};
		const route = this.url + 'api/user/captcha';
		return this.http.post(route,body,{headers:JSONHeaders});
	}
}
