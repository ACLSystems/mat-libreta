export interface Display {
	value: string,
	viewValue: string
}

export interface DisplayWithCategory {
	value: string,
	viewValue: string,
	category: string
}

export interface DisplayGroups {
	name: string;
	disabled?: boolean;
	job: DisplayWithCategory[]
}
