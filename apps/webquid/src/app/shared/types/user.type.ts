export type Identity = {
	identifier: String,
	companies: {
		isActive: Boolean,
		company: {
			isActive: Boolean,
			_id: Boolean,
			name: String,
			display: String,
			identifier: String
		} | String
	}[],
	person?: {
		name?: String,
		fatherName?: String,
		motherName?: String,
		email?: String
	},
	userid: String,
	roles: Roles
}

export type Roles = {
	isAdmin: Boolean,
	isSupervisor: Boolean,
	isOperator: Boolean,
	isTechAdmin: Boolean,
	isBillAdmin: Boolean
}
