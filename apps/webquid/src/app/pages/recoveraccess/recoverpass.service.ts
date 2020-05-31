import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@wqenv/environment';

@Injectable()
export class RecoverPassService {

	url: string;

	constructor(
		private http: HttpClient
	) {
		this.url = environment.url;
	}


	regainAccess(identifier: string, api: string): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		const route: string = `${this.url}api/${api}/${identifier}`;
		return this.http.get(route,{headers})
	}

	// requestPassRecovery(identifier: string): Observable<any> {
	// 	let headers = new HttpHeaders({
	// 		'Content-Type': 'application/json'
	// 	});
	// 	const route: string = this.url + 'api/reqpassrecovery/' + identifier;
	// 	return this.http.get(route,{headers})
	// }
	//
	// otp(identifier: string): Observable<any> {
	// 	let headers = new HttpHeaders({
	// 		'Content-Type': 'application/json'
	// 	});
	// 	const route: string = this.url + 'api/generateonetimepass/' + identifier;
	// 	return this.http.get(route,{headers})
	// }
}
