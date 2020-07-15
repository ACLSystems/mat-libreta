import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from '@wqshared/services/common.service';
import { JSONHeaders } from '@mat-libreta/shared';
import { environment } from '@wqenv/environment';

@Injectable({providedIn: 'root'})
export class SuperService{
	url: string

	constructor(
		private http: HttpClient,
		private commonService: CommonService
	) {
		this.url = environment.url;
	}

	getToken() {
		return this.commonService.getToken();
	}

	getIdentity() {
		return this.commonService.getidentity();
	}

	searchUsers(search:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				),
				params: new HttpParams()
				.set(
					'companies', `["${search}"]`,
				)
				.set(
					'perPage', '500'
				)
			}
			const route = this.url+'api/v1/supervisor/user';
			// console.log(httpOptions);
			return this.http.get(route,httpOptions);
		}
		return null
	}

	searchCompanies(search:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				),
				params: new HttpParams().set(
					'general', search
				)
			}
			const route = this.url+'api/v1/supervisor/company';
			return this.http.get(route,httpOptions);
		}
		return null
	}

	getUser(id:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				)
			}
			const route = this.url+'api/v1/supervisor/user/'+id;
			return this.http.get(route,httpOptions);
		}
		return null
	}

}
