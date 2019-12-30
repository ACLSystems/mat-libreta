import { TypeAccount } from '@crmshared/types/account.type';
import { Happy } from '@crmshared/types/happy.type';
import { Address } from '@crmshared/types/address.type';
import { Mod } from '@crmshared/types/mod.type';
import { Social } from '@crmshared/types/social.type';

export interface Person {
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

export interface Owner {
	_id: string,
	person: Person
}

export type ContactType =
	'lead'|
	'contact'|
	'internal'|
	'partner'|
	'reseller'|
	'other';

export type ContactRole =
			'Decision Maker'|
			'Executive Sponsor'|
			'Admin/Project Manager'|
			'Finance'|
			'Legal'|
			'Purchase'|
			'Technical'|
			'Other';

export type Source =
	'web'|
	'phone'|
	'email'|
	'fresh'|
	'direct'|
	'referal'|
	'social'|
	'event';

export type TypeOwner = string | Owner;

export interface Contact {
	name: string,
	type: ContactType[],
	org?: TypeAccount[],
	contactRole?: ContactRole[],
	_id?: string,
	char1?: string,
	char2?: string,
	flag1?: string,
	flag2?: string,
	happiness?: Happy,
	hasAuthority?: boolean,
	source?: Source,
	tags?: string[],
	unSubscribe?: boolean,
	person?: Person,
	owner?: TypeOwner,
	address?: Address[],
	social?: Social,
	mod?: Mod[]
}

export type TypeContact = string | Contact;
