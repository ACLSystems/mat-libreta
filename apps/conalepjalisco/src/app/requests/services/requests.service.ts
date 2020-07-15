import {
	HttpClient,
	HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SimpleGlobal } from 'ng2-simple-global';

import {
	CommonService,
	JSONHeaders
} from '@mat-libreta/shared';

@Injectable({
	providedIn: 'root'
})
export class RequestService {

	url: string;
	org: string;

	constructor(
		private commonService: CommonService,
		private http: HttpClient,
		private sg: SimpleGlobal
	) {
		this.url = localStorage.getItem('url');
		this.org = this.sg['environment']?.orgName;
	}

	getToken() {
		return this.commonService.getToken();
	}

	getCourses(): Observable<any> {
		const httpOptions = {
			params: new HttpParams()
				.set('org', this.org)
		}
		const route = `${this.url}api/course/list`;
		return this.http.get(route,httpOptions);
	}

	getMyOU(): Observable<any> {
		const myOU = JSON.parse(localStorage.getItem('identity')).orgUnit;
		if(!myOU) return null;
		const route = `${this.url}api/orgunit/${myOU}`;
		return this.http.get(route);
	}

	getOUs(parent:string): Observable<any> {
		if(!parent) return null;
		const route = `${this.url}api/orgunits/${this.org}/${parent}?limit=100`;
		return this.http.get(route);
	}

	getGroups(ou:string,course:string) {
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = `${this.url}api/v1/groups/${ou}/${course}`;
		return this.http.get(route, httpOptions);
	}

	muir(user:any): Observable<any> {
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const body = JSON.stringify(user);
		const route = `${this.url}api/v1/requester/user/muir`;
		return this.http.post(route, body, httpOptions);
	}

}
