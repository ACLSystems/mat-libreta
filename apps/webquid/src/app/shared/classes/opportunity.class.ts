// Classes
import { Account } from '@crmshared/classes/account.class';
import { Product } from '@crmshared/classes/product.class';
// Types
import { Mod } from '@crmshared/types/mod.type';
import { Owner } from '@crmshared/types/contact.type';
import { Currency } from '@crmshared/types/currency.type';

export class Opportunity {
	name							: string;
	closed						: boolean;
	product						: string|Product;
	plan							: string;
	base							: string;
	quantity					: number;
	owner							: Owner;
	org								: string|Account;
	_id?							: string;
	number?						: number;
	status?						: number;
	mainCurrency?			: string|Currency;
	backCurrency?			: string|Currency;
	value?						: number;
	mrr?							: number;
	type?							: number;
	probability?			: number;
	discount?					: number;
	date?							: Date;
	expectedCloseDate?: Date;
	closeDate?				: string;
	relatedUsers?			: string[];
	mod?							: Mod[];

	constructor(
		opp: object
	) {
		Object.assign(this,opp);
	}
}
