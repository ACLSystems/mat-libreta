import { Address } from './addresses.type';

export type Company = {
	_id: String,
	type: String,
	alias?: string,
	phone?: String[],
	isActive: Boolean,
	created?: Date,
	updated?: Date,
	name: String,
	display?: String,
	identifier: String,
	addresses?: Address[],
	__v?: Number
}
