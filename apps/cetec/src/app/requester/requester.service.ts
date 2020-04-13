import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Identity, JSONHeaders } from '@mat-libreta/shared';

import { environment } from '@cetecenv/environment';

@Injectable()
export class RequesterService {
	public url: string;
	public identity: Identity;
	public token: any;
	public roles: any;
	public org: string;

	constructor(
		private http: HttpClient
	) {
		this.url = environment.url;
		this.org = environment.instanceName;
	}

	getCourses(): Observable<any> {
		const httpOptions = {
			params: new HttpParams()
				.set('org', this.org)
		}
		const route = this.url + 'api/course/list';
		return this.http.get(route, httpOptions);
		//return this.http.get(this.url+'api/course/list?org=' + this.org, {observe: 'response'});
	}

	enroll(courseid:string, token:string):Observable<any>{
		const params = JSON.stringify({
			courseid
		});
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + token
			);
		const route = this.url+'api/v1/user/enroll';
		return this.http.post(route, params, {headers});
	}

}
