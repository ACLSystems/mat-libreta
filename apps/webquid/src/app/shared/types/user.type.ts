import { Company } from './companies.type';

export type Identity = {
	identifier: String,
	companies: {
		isActive: Boolean,
		beginDate?: String|Date,
		company: Company,
		vacationHistory?: any[],
		vacations: any
	}[],
	person?: Person,
	userid: String,
	roles: Roles
}

export type Person = {
	name?: String,
	fatherName?: String,
	motherName?: String,
	email?: String,
	curp?: String,
	imss?: String
}

export type Roles = {
	isAdmin: Boolean,
	isRequester: Boolean,
	isSupervisor: Boolean,
	isOperator: Boolean,
	isTechAdmin: Boolean,
	isBillAdmin: Boolean
}
