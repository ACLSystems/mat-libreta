import { Mod } from '@crmshared/types/mod.type';

export interface Note {
	_id: string,
	text: string,
	mod: Mod[]
}
