export interface Display {
	value: string,
	viewValue: string
}

export interface DisplayWithCategory extends Display{
	category: string
}

export interface DisplayGroups {
	name: string;
	disabled?: boolean;
	job: DisplayWithCategory[]
}
