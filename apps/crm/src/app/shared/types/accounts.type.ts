export interface Account {
	_id: string,
	type: [],
	tags?: [],
	name: string,
	longName: string,
	owner: {
		_id?: string,
		name: string,
		person: {
			emails?: [],
			name: string,
			fatherName: string,
			motherName: string,
			email: string,
			birthDate?: Date
		}
	}
}
