import { Mod } from '@crmshared/types/mod.type';

export type Currency = {
	name				: string,
	symbol			: string,
	price				: number,
	displayName?: string,
	base?				: Currency,
	isActive?		: boolean,
	mod?				: Mod[]
}
