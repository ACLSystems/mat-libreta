import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RefreshDiscussionService {


	private refreshDiscussion = new Subject<string>();

	getRefreshDiscussion = this.refreshDiscussion.asObservable();

	sendRefresh(data: string) {
		this.refreshDiscussion.next(data);
	}

}
