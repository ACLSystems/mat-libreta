export type Identity = {
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
