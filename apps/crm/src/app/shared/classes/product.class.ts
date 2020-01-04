import { Mod } from '@crmshared/types/mod.type';
import { Plan, Vendor, Feature, AddOn} from '@crmshared/types/product.type';

export class Product {
	name										: string;
	plan										: Plan[];
	type										: number;
	_id?										: string;
	version?								: string;
	catLevel1?							: string;
	catLevel2?							: string;
	catLevel3?							: string;
	isActive?								: boolean;
	terms?									: string[];
	vendor?									: Vendor;
	features?								: Feature[];
	addOn?									: AddOn[];
	addOnGeneralDescription?: string;
	mod?										: Mod[];
}
