import { Mod } from '@crmshared/types/mod.type';
import { Currency } from '@crmshared/types/currency.type';

export type Vendor = {
	name		: string,
	isActive: boolean,
	mod?		: Mod[]
}

// export type BaseName =
// 	'Anual'|
// 	'Mensual'|
// 	'Trimestral'|
// 	'Semestral';

export type Base = {
	name	: string,
	period: number
}

export type Price = {
	base		: string,
	price		: number,
	discount: number
}

// export type PriceBase =
// 	'/agente/mes'|
// 	'Único pago'|
// 	'Otro';

export type Plan = {
	name				: string,
	price				: Price[],
	priceBase		: number,
	currency		: string | Currency,
	base?				: Base[],
	level?			: number,
	description?: string,
}

export type Feature = {
	plan				: string,
	text				: string,
	description?: string
}

export type AddOn = {
	name				: string,
	minPlanLevel: number,
	price				: number,
	priceBase		: number,
	currency		: string | Currency
	description?: string,
}

// export type ProductType =
// 	'Servicio'|
// 	'Producto'|
// 	'Otro';

// export interface Product {
// 	name: string
// 	plan: Plan[],
// 	type: number,
// 	_id?: string,
// 	version?: string,
// 	catLevel1?: string,
// 	catLevel2?: string,
// 	catLevel3?: string,
// 	isActive?: boolean,
// 	terms?: string[],
// 	vendor?: Vendor,
// 	features?: Feature[],
// 	mod?: Mod[],
// 	addOn?: AddOn[],
// 	addOnGeneralDescription?: string
// }
