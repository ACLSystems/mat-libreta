import { Company } from './companies.type';

export type Publicity = {
	priority?: Number,
	_id?: String,
	text: String,
	image?: String,
	endDate?: String | Date,
	companies?: {
		isActive: Boolean,
		company: Company
	}[]
}
