import { Mod } from '@crmshared/types/mod.type';

export type Note = {
	_id?: string,
	id?	: string,
	text: string,
	mod?: Mod[]
}
