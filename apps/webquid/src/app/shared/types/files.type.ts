export type FileString = {
	name: string,
	size: number,
	type: string,
	mimeType?: string,
	data?: any,
	error?: string,
	result?: string
}

export type FileResult = {
	message: string,
	emisorCreated: boolean,
	subhireCreated: boolean,
	userCreated: boolean,
	dataCreated: boolean
}
