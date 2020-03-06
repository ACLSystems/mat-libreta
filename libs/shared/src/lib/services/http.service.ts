import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from './common.service';
import { JSONHeaders } from './httpHeaders';

const key = '';

@Injectable()
export class HTTPService {

	public url: string;

	constructor(
		private http: HttpClient,
		private commonService: CommonService
	) {
		this.url = this.commonService.getEnvironment().url;
	}

	post(route: string, body: any): Observable<any> {
		// console.group('Post')
		// console.log('Ruta ',route);
		// console.log(body)
		// console.groupEnd();
		return this.http.post(route,JSON.stringify(body),{headers:JSONHeaders})
	}

	get(route: string, query?:any) {
		const url = query ? `${route}?${query}` : route;
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				`Basic ${key}`
			)
		}
		console.group('get')
		console.log('Ruta ',route);
		console.groupEnd();
		return this.http.get(url,httpOptions);
	}
}
