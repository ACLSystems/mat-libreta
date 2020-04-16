import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from '@wqshared/services/common.service';
import { JSONHeaders } from '@mat-libreta/shared';
import { environment } from '@wqenv/environment';

@Injectable({providedIn: 'root'})
export class ConfigService{

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

	getConfig(): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
			const route = this.url+'api/v1/admin/config';
			return this.http.get(route,{headers});
		}
		return null
	}

	setConfig(body: any): Observable<any>|null {
		const token = this.getToken();
		if(token) {
			const params = JSON.stringify(body);
			const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
			const route = this.url+'api/v1/admin/config';
			return this.http.patch(route,params,{headers});
		}
		return null
	}

}
