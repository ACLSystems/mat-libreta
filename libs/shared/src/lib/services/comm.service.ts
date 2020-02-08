import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

const defaultNamespace = 'message';

@Injectable()
export class CommService {
	constructor(
		private socket: Socket
	) {}

	sendMessage(
		namespace: string = defaultNamespace,
		msg: any) {
		this.socket.emit(namespace, msg);
	}

	getMessage(
		namespace: string = defaultNamespace
	) {
		return this.socket
			.fromEvent(namespace);
	}
}
