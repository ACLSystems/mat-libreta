// Classes
import { Account } from '@crmshared/classes/account.class';
import { Contact } from '@crmshared/classes/contact.class';
import { Opportunity } from '@crmshared/classes/opportunity.class';
import { Business } from '@crmshared/classes/business.class';
// Types
import { Owner } from '@crmshared/types/contact.type';
import { Currency } from '@crmshared/types/currency.type';
import { Mod } from '@crmshared/types/mod.type';


export class Quote {
	customer				: Contact;
	org							: Account;
	customerOrg			: Account;
	_id?						: string
	status?					: number;
	numberInternal?	: number;
	number?					: string;
	date?						: Date;
	validDate?			: Date;
	business?				: string|Business[];
	owner?					: string|Owner;
	relatedUsers?		: (string|Contact)[];
	opportunities?	: (string|Opportunity)[];
	currency?				: string|Currency;
	discount?				: number;
	taxName?				: string;
	tax?						: number;
	terms?					: string[];
	version?				: number;
	mod?						: Mod[];

	constructor(
		quote: object
	) {
		Object.assign(this,quote);
	}
}
