import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// import { CommonService } from '@wqshared/services/common.service';
import { JSONHeaders } from '@mat-libreta/shared';
import { environment } from '@wqenv/environment';

@Injectable({providedIn: 'root'})
export class CVService{
	url: string;

	constructor(
		private http: HttpClient,
		// private commonService: CommonService
	) {
		this.url = environment.url;
	}


	getCV(token:string): Observable<any>|null {
		const httpOptions = {
			params: new HttpParams().set(
				'token', token
			)
		};
		const route = this.url+'api/getcvbytoken';
		return this.http.get(route,httpOptions);
	}

	updateCV(sendForm: any): Observable<any>|null {
		const route = this.url+'api/updatecv';
		return this.http.patch(route,sendForm,{headers: JSONHeaders});
	}


}
