import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@wqenv/environment';

@Injectable()
export class RecoverAccessService {

	url: string;

	constructor(
		private http: HttpClient
	) {
		this.url = environment.url;
	}


	validate(identifier: string, key: string, password: string): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		let body = {
			identifier,
			validationString: key,
			password
		};
		const route: string = `${this.url}api/validatepassrecovery`;
		return this.http.patch(route,body,{headers})
	}

}
