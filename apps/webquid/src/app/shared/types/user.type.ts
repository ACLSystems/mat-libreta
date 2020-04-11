import { Company } from './companies.type';

export type Identity = {
	identifier: String,
	companies: {
		isActive: Boolean,
		company: Company
	}[],
	person?: Person,
	userid: String,
	roles: Roles
}

export type Person = {
	name?: String,
	fatherName?: String,
	motherName?: String,
	email?: String
}

export type Roles = {
	isAdmin: Boolean,
	isSupervisor: Boolean,
	isOperator: Boolean,
	isTechAdmin: Boolean,
	isBillAdmin: Boolean
}
