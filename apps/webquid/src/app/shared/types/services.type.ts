import { Company } from './companies.type';

export type Service = {
	_id: string,
	tag?: string[],
	title: string,
	description?: string,
	icon?: string,
	iconColor?: string,
	role?: string,
	category?: string,
	blank?: string,
	companies: {
		isActive: Boolean,
		company: Company
	}[]
}
