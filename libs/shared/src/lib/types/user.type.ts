export interface Identity {
	admin: {
		isActive: Boolean,
		isDataVerified: Boolean,
		isVerified: Boolean,
		recoverString?: string
	},
	attachedToWShift: Boolean,
	name: string,
	org: string,
	orgUnit: string,
	orgid: string,
	ouid: string,
	person: {
		birthDate: string,
		email: string,
		fatherName: string,
		motherName: string,
		name: string
	},
	userid: string
}

export interface Roles {
	isAdmin: Boolean,
	isBusines: Boolean,
	isOrg: Boolean,
	isOrgContent: Boolean,
	isAuthor: Boolean,
	isSupervisor: Boolean,
	isInstructor: Boolean,
	isRequester: Boolean,
	isUser: Boolean,
}
