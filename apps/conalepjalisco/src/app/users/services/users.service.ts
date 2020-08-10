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
export class UserService {

	url: string;

	constructor(
		private commonService: CommonService,
		private http: HttpClient,
		private sg: SimpleGlobal
	) {
		this.url = localStorage.getItem('url');
	}

	getToken() {
		return this.commonService.getToken();
	}

	getUser(user:string): Observable<any> {
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = `${this.url}api/v1/supervisor/user/getdetails?username=${user}`;
		return this.http.get(route,httpOptions);
	}

	getUserGroups(user:string): Observable<any> {
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = `${this.url}api/v1/supervisor/user/getgroups?username=${user}`;
		return this.http.get(route,httpOptions);
	}

}
