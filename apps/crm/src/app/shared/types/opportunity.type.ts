// import { Mod } from '@crmshared/types/mod.type';
// import { Owner } from '@crmshared/types/contact.type';
// import { Account } from '@crmshared/classes/account.class';
// import { Currency } from '@crmshared/types/currency.type';
//
// // export type TypeOpp = string | Opportunity;
//
// // export type OppStatus =
// // 	'Nueva'|
// // 	'Demo'|
// // 	'Evaluación'|
// // 	'Negociación'|
// // 	'Compromiso'|
// // 	'En pausa'|
// // 	'Ganada'|
// // 	'Perdida';
//
// // export type TypeTypeOpp =
// // 	'Venta nueva'|
// // 	'Renovación'|
// // 	'Upgrade'|
// // 	'Downgrade'|
// // 	'Incremento'|
// // 	'Decremento'|
// // 	'Servicio'|
// // 	'Venta libre'
//
// export interface Opportunity {
// 	name: string,
// 	closed: boolean,
// 	product: string
// 	plan: string,
// 	base: string,
// 	quantity: number,
// 	owner: TypeOwner,
// 	org: TypeAccount,
// 	_id?: string,
// 	number?: number,
// 	status?: OppStatus,
// 	mainCurrency?: TypeCurrency,
// 	backCurrency?: TypeCurrency,
// 	value?: number,
// 	mrr?: number,
// 	type?: TypeTypeOpp,
// 	probability?: number,
// 	discount?: number,
// 	date?: Date,
// 	expectedCloseDate?: Date,
// 	closeDate?: string,
// 	relatedUsers?: string[],
// 	mod?: Mod[]
// }
