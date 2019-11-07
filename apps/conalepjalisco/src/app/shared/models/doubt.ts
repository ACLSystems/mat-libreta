export class Doubt {
	constructor(
		public course: string,
		public group: string,
		public type: string,
		public title: string,
		public text: string,
		public pubtype: string,
		public block?: string,
		public sendTo?: string
	) {

	}
}
