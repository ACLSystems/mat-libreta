import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from '@wqshared/services/common.service';
import { JSONHeaders } from '@mat-libreta/shared';
import { environment } from '@wqenv/environment';

@Injectable({providedIn: 'root'})
export class JobsService{
	url: string;

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

	getCVs(ticket?:number): Observable<any>|null {
		const token = this.getToken();
		const identity = this.getIdentity();
		// console.group('Roles getCVs');
		// console.log(identity.roles);
		// console.groupEnd();
		if(token) {
			const httpOptions = ticket ? {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				),
				params: new HttpParams().set(
					'ticket', ticket + ''
				)
			} : {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				)
			}
			const route = identity.roles.isRequester ? this.url+'api/v1/requester/cvs' : this.url+'api/v1/operator/cvs';
			// console.log(route);
			return this.http.get(route,httpOptions);
		}
		return null
	}

	searchCompanies(search?:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = search ? {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				),
				params: new HttpParams().set(
					'companies', `["${search}"]`
				)
			} : {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				)
			}
			const route = this.url+'api/v1/operator/company';
			return this.http.get(route,httpOptions);
		}
		return null
	}

	listJobs(): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				)
			}
			const route = this.url+'api/v1/operator/jobs';
			return this.http.get(route,httpOptions);
		}
		return null
	}

	createJob(name: string, category: string): Observable<any>|null {
		const params = JSON.stringify({
			name,category
		});
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/operator/job';
		return this.http.post(route, params, {headers});
	}

	createCV(cv:any): Observable<any>|null {
		const params = JSON.stringify(cv);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/operator/initiatecv';
		return this.http.post(route, params, {headers});
	}

}
