export class Comment{
	constructor(
		public course: string,
		public group: string,
		public type: string,
		public root: string,
		public replyto: string,
		public text: string,
		public block?: string
	) {}
}
