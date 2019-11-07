import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@cjaenv/environment';

@Injectable()
export class RecoverPassService {

	url: string;

	constructor(
		private http: HttpClient
	) {
		this.url = environment.url;
	}

	requestPassRecovery(email: string): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		const route: string = this.url + 'api/user/validateemail?email' + email;
		return this.http.post(route,{headers})
	}
}
