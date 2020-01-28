export interface Result {
	response: number | boolean | string | string [],
	responseString: string | string [],
	answer: number | string | boolean | string [],
	answerString: string | string [],
	type: string,
	index?: number,
	indexquestion?: number,
	result: boolean,
	points: number
}

export interface Response {
	indexquestion: string,
	result: Result[],
	points?: number
}

export interface Option {
	name: string,
	value: string,
	eval?: number
}

export interface Answer {
	type: string,
	index: number,
	tf?: string,
	group?: string[] | any[]
}

export interface Question {
	header?: string,
	footer?: string,
	footerShow?: boolean,
	display?: any[],
	text?: string,
	group?: string[],
	id: string,
	label?:	string,
	options?: Option[],
	answers?: Answer[],
	isVisible?: boolean,
	help?: string,
	type: string,
	order?: boolean,
	w: number
}

export interface Questionnarie {
	org?: any,
	begin: boolean,
	id: string,
	maxAttempts: number,
	minimum: number,
	questions: Question[],
	isVisible?: boolean,
	type: string,
	w: number,
	diagnostic?: {
		aspects: [
			{
				name?: string,
				min?: number,
				max?: number,
				eval?: [
					{
						min?: number,
						max?: number,
						results?: string,
						notes?: string
					}
				]
			}
		],
		notes: {
			text?: string,
			show: boolean
		}
	}
}

export interface Task {
	header?: string,
	footer?: string,
	id: string,
	label?: string,
	text: string,
	type: string,
	files?: string[],
	w?: number
}

export interface Block {
	blockBegin?: boolean,
	blockCode: string,
	blockContent: string,
	blockCurrentId: string,
	blockMedia?: string[],
	blockMinimumTime: number,
	blockNextId: string,
	blockNumber: number,
	blockPrevId: string,
	blockSection: number,
	blockTitle: string,
	blockTrack: boolean,
	blockType: string,
	blockUnitBeginning?: string | Date,
	courseCode: string,
	groupCode: string,
	rosterid: string,
	studentid: string,
	questionnarie?: Questionnarie,
	maxGrade?: number,
	lastAttempt?: string | Date,
	track?: number,
	blockGrade?: number,
	blockGradedQ?: boolean,
	blockGradedT?: boolean,
	attempts?: number,
	tasks?: Task[]
}

export interface BlockGrade {
	blockId: string,
	blockNumber: number,
	blockOrder?: number,
	blockSection: number,
	blockTitle: string,
	blockType: string,
	blockW: number,
	grade: number
}

export interface Grade {
	beginDate: DataViewConstructor,
	beginDateSpa: string,
	blocks: BlockGrade[],
	certificateActive: boolean,
	certificateNumber: string,
	certificateTutor: boolean,
	course: string,
	courseId: string,
	courseDurUnits: string,
	courseDuration: number,
	duration: string,
	durationUnits: string,
	endDate: Date,
	endDateSpa: string
	finalGrade: number,
	folio: string,
	folioStatus: string,
	groupType: string,
	groupid: string,
	minGrade: number,
	minTrack: string,
	name: string,
	pass: boolean,
	passDate: Date,
	passDateSpa: string,
	rosterid: string,
	status: string,
	track: string
}
