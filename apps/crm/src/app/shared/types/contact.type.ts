export interface Contact {
	name: string,
	org?: {
		_id: string,
		name: string
	}[],
	type: string[],
	contactRole: string[],
	_id: string,
	char1?: string,
	char2?: string,
	flag1?: string,
	flag2?: string,
	happiness?: string,
	hasAuthority?: boolean,
	source?: string,
	tags?: string[],
	unSubscribe?: boolean,
	person: {
		birthDate?: string,
		email: string,
		emails?: string[],
		fatherName: string,
		motherName?: string,
		name: string,
		mainPhone: string,
		phone: string,
		cellPhone: string
	},
	owner?: {
		_id: string,
		person?: {
			name: string,
			fatherName: string,
			motherName?: string,
			emails?: string[],
			email: string,
			birthDate?: string
		}
	},
	address?: {
		city?: string,
		country?: string,
		ext?: string,
		int?: string,
		locality?: string,
		postalCode?: string,
		state?: string,
		street?: string,
		suburb?: string
	}[],
	social?: {
		facebook?: string,
		twitter?: string,
		linkedin?: string,
		google?: string,
		instagram?: string,
		skype?: string
	}
}
