// Classes
import { Account } from '@crmshared/classes/account.class';
import { Contact } from '@crmshared/classes/contact.class';
import { Product } from '@crmshared/classes/product.class';
// Types
import { Mod } from '@crmshared/types/mod.type';
import { Owner } from '@crmshared/types/contact.type';
import { Currency } from '@crmshared/types/currency.type';

export class Business {
	name					: string;
	org						: string | Account;
	owner					: string | Owner;
	_id?					: string;
	status				: string;
	closed				: boolean;
	product				: string | Product;
	mainCurrency	: string | Currency;
	type					: number;
	relatedUsers?	: (string|Contact)[];
	backCurrency?	: string | Currency;
	date					: string;
	number				: number;
	value					: number;
	mod?					: Mod[];

	constructor(
		business: object
	) {
		Object.assign(this,business);
	}
}
