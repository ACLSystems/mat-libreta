import { Address } from './addresses.type';

export type Company = {
	_id?: string,
	type: string,
	alias?: string,
	phone?: string[],
	isActive: Boolean,
	created?: Date,
	updated?: Date,
	name: string,
	display?: string,
	identifier: string,
	addresses?: Address[],
	customersRelated?: any[],
	employerRegistration?: string[],
	payersRelated?: any[]
	__v?: Number
}
