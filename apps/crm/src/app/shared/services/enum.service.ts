import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// import { JSONHeaders } from '@crmshared/services/httpHeaders';
import { environment } from '@crmenv/environment';

// Classes

// TYPES
import { Language } from '@crmshared/types/language.type';

@Injectable()
export class EnumService {
	url							: string;
	language				: Language;

	constructor(
		private http: HttpClient,
	) {
		this.url = environment.url;
		let lang = JSON.parse(localStorage.getItem('myLanguage'));
		if(lang) {
			this.language = lang;
		} else {
			this.language = JSON.parse(localStorage.getItem('defaultLanguage'));
		}
	}

	getEnum(schemaName: string, field: string): Observable<any> {
		let httpOptions = {
			params: new HttpParams()
				.set('language', this.language._id)
				.set('schemaName',schemaName)
				.set('field', field)
		}
		const route = this.url+'enums';
		return this.http.get(route,httpOptions);
	}

}
