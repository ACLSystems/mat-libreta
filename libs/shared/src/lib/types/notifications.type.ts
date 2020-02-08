export interface Bell {
	newNotifications: number
}

export interface Notification {
	notificationid: number,
	source: {
		kind: string,
		role: string,
		item?: {
			_id: string,
			person?: {
				birthDate?: string,
				name?: string,
				fatherName?: string,
				motherName?: string
			}
		}
	},
	sourceType: string,
	sourceRole: string,
	destinationRole: string,
	destination: {
		kind: string,
		role: string,
		item?: {
			_id: string,
			person?: {
				birthDate?: string,
				name?: string,
				fatherName?: string,
				motherName?: string
			}
		}
	},
	message: string,
	read: boolean,
	dateAgo: string,
	date: Date,
	objects?: {
		kind?: string,
		item?: {
			_id?: string,
			code?: string,
			title?: string,
			name?: string
		} | null,
	} []
}

export interface Command {
	command: string;
	channel: string;
	message: string;
}
