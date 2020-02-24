// Classes
import { Account } from '@crmshared/classes/account.class';
import { EmailValidator } from '@crmshared/classes/email.class';
// Types
import { Person, Owner } from '@crmshared/types/contact.type';
import { Address } from '@crmshared/types/address.type';
import { Social } from '@crmshared/types/social.type';
import { Mod } from '@crmshared/types/mod.type';

export class Contact {
	name					: string;
	type					: number[];
	org?					: (string|Account)[];
	contactRole?	: number[];
	_id?					: string;
	char1?				: string;
	char2?				: string;
	flag1?				: string;
	flag2?				: string;
	happiness?		: number;
	hasAuthority?	: boolean;
	source?				: number;
	tags?					: string[];
	unSubscribe?	: boolean;
	person?				: string | Person;
	owner?				: string | Owner;
	address?			: Address[];
	social?				: Social;
	mod?					: Mod[]

	constructor(
		contact: object
	) {
		Object.assign(this, contact);
		if(!EmailValidator.isAcceptable(this.name)) {
			throw new Error('Valor debe ser cuenta de correo válida');
		}
	}
 }
