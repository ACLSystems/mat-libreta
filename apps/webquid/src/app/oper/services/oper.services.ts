import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from '@wqshared/services/common.service';
import { JSONHeaders } from '@mat-libreta/shared';
import { environment } from '@wqenv/environment';

@Injectable({providedIn: 'root'})
export class OperService{
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

	searchUsers(search:string): Observable<any>|null {
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
			const route = this.url+'api/v1/operator/user';
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
			const route = this.url+'api/v1/operator/company';
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
			const route = this.url+'api/v1/operator/user/'+id;
			return this.http.get(route,httpOptions);
		}
		return null
	}

	getCompany(id:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				)
			}
			const route = this.url+'api/v1/operator/company/'+id;
			return this.http.get(route,httpOptions);
		}
		return null
	}

}
