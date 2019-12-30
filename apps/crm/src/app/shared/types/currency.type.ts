import { Mod } from '@crmshared/types/mod.type';

export type TypeCurrency = string | Currency;

export interface Currency {
	name: string,
	symbol: string,
	price: number,
	displayName?: string,
	base?: Currency,
	isActive?: boolean,
	mod?: Mod[]
}
