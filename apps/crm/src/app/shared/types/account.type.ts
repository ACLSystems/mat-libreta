export interface Account {
	name: string,
	longName: string,
	alias?:string[],
	isActive?: boolean,
	type: string[],
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
	},
	owner?: {
		_id: string,
		person: {
			name: string,
			fatherName: string,
			motherName: string,
			emails?: string[],
			email: string,
			birthDate?: string
		}
	},
	mainPhone?: string,
	phone?:string,
	emails?:string[],
	emailDomain?:string,
	happiness?:string,
	tags?: string[]
}
