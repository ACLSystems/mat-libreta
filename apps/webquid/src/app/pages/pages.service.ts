import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { JSONHeaders, Identity } from '@mat-libreta/shared';
import { environment } from '@wqenv/environment';

@Injectable()
export class PagesService {
	public url: string;
	public identity: Identity;
	public token: any;
	public roles: any;
	public org: string;

	constructor(private http: HttpClient) {
		this.url = environment.url;
	}

	captcha(response:string) {
		let body = {response};
		const route = this.url + 'api/user/captcha';
		return this.http.post(route,body,{headers:JSONHeaders});
	}
}
