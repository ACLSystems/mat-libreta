import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from '@wqshared/services/common.service';
import { JSONHeaders } from '@mat-libreta/shared';
import { environment } from '@wqenv/environment';
import { Company } from '@wqshared/types/companies.type';

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

	searchUsersByCompany(search:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				),
				params: new HttpParams().set(
					'companies', `["${search}"]`
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

	createUser(user:any): Observable<any>|null {
		const params = JSON.stringify(user);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/operator/user';
		return this.http.post(route, params, {headers});
	}

	createCompany(company:Company): Observable<any>|null {
		const params = JSON.stringify(company);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/operator/company';
		return this.http.post(route, params, {headers});
	}

	updateCompany(company:any): Observable<any>|null {
		let id = company.id;
		delete company.id;
		const params = JSON.stringify(company);
		const headers = JSONHeaders.set(
				'Authorization',
				`Bearer ${this.getToken()}`
			);
		const route = this.url+'api/v1/operator/company/'+id;
		return this.http.patch(route, params, {headers});
	}

	resetPass(userid:string, newPass: string): Observable<any>|null {
		const params = JSON.stringify({
			userid,newPass
		});
		const headers = JSONHeaders.set(
				'Authorization',
				`Bearer ${this.getToken()}`
			);
		const route = this.url+'api/v1/resetpass';
		return this.http.patch(route, params, {headers});
	}

	searchUserDocuments(userid:string, date?:Date): Observable<any>|null {
		const token = this.getToken();
		// console.log('date',date);
		const dateCalc = date ? `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`: null;
		// console.log('dateCalc',dateCalc);
		var params = date ?
			new HttpParams().set(
				'user',userid
			).set(
				'date',dateCalc
			).set(
				'documentType','cfdi'
			).set(
				'subDocumentType','nomina12'
			) :
			new HttpParams().set(
				'user',userid
			).set(
				'documentType','cfdi'
			).set(
				'subDocumentType','nomina12'
			);
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + this.getToken()
				),params
			}
			// console.log(httpOptions);
			const route = this.url+'api/v1/attachment';
			return this.http.get(route,httpOptions);
		}
		return null
	}

	getUserDocument(docid:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const httpOptions = {
				headers: JSONHeaders.set(
					'Authorization',
					'Bearer ' + token
				)
			};
			const route = `${this.url}api/v1/attachment/${docid}`;
			return this.http.get(route, httpOptions);
		}
		return null;
	}

	addUserEmail(identifier:string,email:string): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const params = JSON.stringify({
				identifier,email
			});
			const headers = JSONHeaders.set(
					'Authorization',
					`Bearer ${this.getToken()}`
				);
			const route = this.url+'api/v1/adduseremail';
			return this.http.patch(route, params, {headers});
		}
		return null;
	}

}
