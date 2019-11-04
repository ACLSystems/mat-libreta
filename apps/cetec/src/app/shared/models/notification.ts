import { Objects } from './objects';

export class Notification {
	constructor(
		public destination: any,
		public message: string,
		public destinatioRoles: any,
		public objects: Objects[],
		public sourceRole?: any
	) {}
}
