import { Mod } from '@crmshared/types/mod.type';
import { TypeCurrency } from '@crmshared/types/currency.type';

export interface Vendor {
	name: string,
	isActive: boolean,
	mod?: Mod[]
}

export type BaseName =
	'Anual'|
	'Mensual'|
	'Trimestral'|
	'Semestral';

export interface Base {
	name: string,
	period: number
}

export interface Price {
	base: string,
	price: number,
	discount: number
}

export type PriceBase =
	'/agente/mes'|
	'Único pago'|
	'Otro';

export interface Plan {
	name: string,
	price: Price[],
	priceBase: PriceBase,
	currency: TypeCurrency,
	base?: Base[],
	level?: number,
	description?: string,
}

export interface Feature {
	plan: string,
	text: string,
	description?: string
}

export interface AddOn {
	name: string,
	minPlanLevel: number,
	price: number,
	priceBase: PriceBase,
	currency: TypeCurrency
	description?: string,
}

export type ProductType =
	'Servicio'|
	'Producto'|
	'Otro';

export interface Product {
	name: string
	plan: Plan[],
	type: ProductType,
	_id?: string,
	version?: string,
	catLevel1?: string,
	catLevel2?: string,
	catLevel3?: string,
	isActive?: boolean,
	terms?: string[],
	vendor?: Vendor,
	features?: Feature[],
	mod?: Mod[],
	addOn?: AddOn[],
	addOnGeneralDescription?: string
}
