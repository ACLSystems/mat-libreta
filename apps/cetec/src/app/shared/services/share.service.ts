import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {
	Notification
} from '@mat-libreta/shared';

@Injectable({
	providedIn: 'root'
})
export class ShareService {


	private notifData = new Subject<Notification[]>();

	getNotifData = this.notifData.asObservable();

	sendEvent(data: Notification[]) {
		this.notifData.next(data);
	}

}
