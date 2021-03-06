import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class CommService {
	constructor(
		private socket: Socket
	) {}

	sendMessage(msg: string) {
		this.socket.emit('message', msg);
	}

	getMessage() {
		return this.socket
			.fromEvent('message');
	}
}
