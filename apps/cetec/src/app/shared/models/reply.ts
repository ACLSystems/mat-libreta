export class Reply {
	constructor(
		public course: string,
		public group: string,
		public type: string,
		public root: string,
		public comment: string,
		public replyto: string,
		public text: string,
		public block?: string
	) {}
}
