export class Discussion {
	constructor(
		public course: string,
		public group: string,
		public title: string,
		public text: string,
		public block?:string
	){}
}
