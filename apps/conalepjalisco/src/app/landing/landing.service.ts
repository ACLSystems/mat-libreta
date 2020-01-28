import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@cjaenv/environment';
import { JSONHeaders } from '@mat-libreta/shared';

@Injectable()
export class LandingService {

	public url: string;

	constructor(
		private http: HttpClient
	) {
		this.url = environment.url;
	}

	/*
	método para confirmar la cuenta del usuario
	*/
	userConfirm(confirm:any):Observable<any>{
		let params = JSON.stringify(confirm);
		const route = this.url+'api/user/confirm';
		return this.http.post(route, params, {headers: JSONHeaders});
	}
}
