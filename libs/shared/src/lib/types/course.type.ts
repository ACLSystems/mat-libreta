export interface CurrentCourse {
	block: string,
	course: string,
	courseCode: string,
	courseid: string,
	id: string,
	rosterType: string,
	notification?: boolean
}

export type Discussion = {
	course:any,
	group?:any,
	title:string,
	text:string,
	block?:any,
	type?: string,
	pubType?: string,
	discussionId?:string,
	when?: string,
	date?: string,
	userId?: string,
	user?: string,
	replyto?: string,
	root?: string,
	replyme?: boolean
}
