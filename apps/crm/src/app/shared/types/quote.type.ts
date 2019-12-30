import { Mod } from '@crmshared/types/mod.type';
import { TypeAccount } from '@crmshared/types/account.type';
import { TypeContact, TypeOwner } from '@crmshared/types/contact.type';
import { TypeBusiness} from '@crmshared/types/business.type';
import { TypeOpp } from '@crmshared/types/opportunity.type';
import { TypeCurrency } from '@crmshared/types/currency.type';

export type QuoteStatus = 'new' |
			'review'|
			'won'|
			'lost';

export interface Quote {
	customer: TypeContact,
	org: TypeAccount,
	customerOrg: TypeAccount,
	_id?: string
	status?: QuoteStatus,
	numberInternal?: number,
	number?: string,
	date?: Date,
	validDate?: Date,
	business?: TypeBusiness[],
	owner?: TypeOwner,
	relatedUsers?: TypeContact[],
	opportunities?: TypeOpp[],
	currency?: TypeCurrency,
	discount?: number,
	taxName?: string,
	tax?: number,
	terms?: string[],
	version?: number,
	mod?: Mod[],
}
