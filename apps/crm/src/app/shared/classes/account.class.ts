import { Observable } from 'rxjs';

import { Owner } from '@crmshared/types/contact.type';
import { Address } from '@crmshared/types/address.type';
import { Mod } from '@crmshared/types/mod.type';
import { Social } from '@crmshared/types/social.type';
import { Note } from '@crmshared/types/notes.type';

// Services
import { EnumService } from '@crmshared/services/enum.service';

export class Account {
	name				: string;
	longName?		: string;
	type?				: string[];
	alias?			:	string[];
	isActive?		: boolean;
	_id?				: string;
	address?		: Address[];
	social?			: Social;
	owner?			: Owner;
	notes?			: Note[];
	mainPhone?	: string;
	phone?			:	string[];
	emails?			:	string[];
	emailDomain?:	string;
	happiness?	: number;
	tags?				: string[];
	mod?				:	Mod[];

	constructor(
		account: object
	){
		Object.assign(this, account);
	}

	addPhone(phone: string){
		this.phone.push(phone);
	}

	static getEnum(field: string): Observable<any> {
		let enumService: EnumService;
		return enumService.getEnum('orgs',field);
	}
}
