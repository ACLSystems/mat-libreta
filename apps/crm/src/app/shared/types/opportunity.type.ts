import { Mod } from '@crmshared/types/mod.type';

export type TypeOpp = string | Opportunity;

export type OppStatus = 'new' |
			'demo'|
			'evaluation'|
			'negotiation'|
			'commitment'|
			'hold'|
			'won'|
			'lost';

export interface Opportunity {
	name: string,
	closed: boolean,
	product: string
	plan: string,
	quantity: number,
	owner: string,
	org: string,
	number?: number,
	status?: OppStatus,
	mainCurrency?: string,
	backCurrency?: string,
	value?: number,
	mrr?: number,
	type?: string
	probability?: number,
	discount?: number,
	base?: string,
	date?: string,
	expectedCloseDate?: string,
	closeDate?: string,
	relatedUsers?: string[],
	mod?: Mod[]
}
