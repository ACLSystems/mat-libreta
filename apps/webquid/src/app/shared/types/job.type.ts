
export type JobPosition = {
	name: string
	place: string,
	functions?: string,
	area: string
}

export type WorkInfo = {
	companyName: string,
	beginDate: Date,
	endDate?: Date,
	current: boolean,
	initialJob: string,
	finalJob: string,
	salary: string,
	reasonToLeave?: string,
	bossName: string,
	companyPhone: string,
	referencePhone: string
}

export type Reference = {
	name: string,
	phone: string
}

export type Family = {
	name: string,
	birthDate: Date,
	relationship: string,
	occupation: string
}

export type Child = {
	name: string,
	birthDate: Date,
	scholarShip: string,
	occupation: string
}

export type Study = {
	studiesGrade: string,
	institute: string,
	beginDate: Date,
	current?: boolean,
	certificatesAchieved: string,
	diplomasAchieved: string,
	endDate?: Date
}
