import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from './common.service';
import { JSONHeaders } from './httpHeaders';

//permitimos con este decorador inyectar a otras dependencias
@Injectable({
	providedIn: 'root'
})
export class SuperService{

	public url: string;


	constructor(
		private http: HttpClient,
		private commonService: CommonService
	) {
		const environment = this.commonService.getEnvironment();
		if(environment && environment.url) {
			this.url = environment.url;
		}
	}

	getToken() {
		return this.commonService.getToken();
	}

	getPublicData(monthNumber:string = '0'): Observable<any> {
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			),
			params: new HttpParams().set(
				'lastnmonths', monthNumber
			)
		};
		const route = this.url + 'api/v1/supervisor/report/publicsumm';
		return this.http.get(route, httpOptions);
	}

	getDetails(dateParam:string): Observable<any> {
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			),
			params: new HttpParams().set(
				'date', dateParam
			)
		};
		const route = this.url + 'api/v1/supervisor/report/publicpro';
		return this.http.get(route, httpOptions);
	}

}
