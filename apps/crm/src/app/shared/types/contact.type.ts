export type Person = {
	name: string,
	email: string,
	fatherName: string,
	birthDate?: string,
	emails?: string[],
	motherName?: string,
	mainPhone?: string,
	phone?: string,
	cellPhone?: string
}

export type Owner = {
	_id: string,
	person: Person
}

// export type ContactType =
// 	'lead'|
// 	'contact'|
// 	'internal'|
// 	'partner'|
// 	'reseller'|
// 	'other';
//
// export type ContactRole =
// 			'Decision Maker'|
// 			'Executive Sponsor'|
// 			'Admin/Project Manager'|
// 			'Finance'|
// 			'Legal'|
// 			'Purchase'|
// 			'Technical'|
// 			'Other';
//
// export type Source =
// 	'web'|
// 	'phone'|
// 	'email'|
// 	'fresh'|
// 	'direct'|
// 	'referal'|
// 	'social'|
// 	'event';
//
// export interface ContactInterface {
// 	name: string,
// 	type: number[],
// 	org?: TypeAccount[],
// 	contactRole?: number[],
// 	_id?: string,
// 	char1?: string,
// 	char2?: string,
// 	flag1?: string,
// 	flag2?: string,
// 	happiness?: number,
// 	hasAuthority?: boolean,
// 	source?: number,
// 	tags?: string[],
// 	unSubscribe?: boolean,
// 	person?: string | Person,
// 	owner?: string | Owner,
// 	address?: Address[],
// 	social?: Social,
// 	mod?: Mod[]
// }
