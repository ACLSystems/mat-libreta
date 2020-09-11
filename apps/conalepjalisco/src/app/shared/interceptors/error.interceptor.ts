import {
	Injectable,
	Injector,
	InjectionToken
} from '@angular/core';
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	// HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as Rollbar from 'rollbar';
import Swal from 'sweetalert2';

const rollbarConfig = {
	accessToken: '4d9b7472ad56491590171e3a2c419734',
	captureUncaught: true,
	captureUnhandledRejections: true,
	enabled: true,
	environment: 'production'
}

export function rollbarFactory() {
	return new Rollbar(rollbarConfig);
}

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

	constructor(
		private injector: Injector
	) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next
			.handle(request)
			.pipe(
				retry(1),
				catchError((error: HttpErrorResponse) => {
					const rollbar = this.injector.get(RollbarService);
					let errorMessage = '';
					let sendError = true;
					if(error.error instanceof ErrorEvent) {
						// client-side error
						console.group('Client error');
						console.log(error);
						console.groupEnd();
						errorMessage = `Error: ${error.error.message}`;
					} else {
						// server-side error
						console.group('Server error');
						console.log(error);
						console.groupEnd();
						if(error.status > 399 && error.status < 500) {
							sendError = false;
						}
						console.log('Status', error.status);
						if(!error.status) {
							errorMessage = `<p>El servidor no responde en este momento. Posiblemente no haya Internet o el servidor esté temporalmente fuera de servicio.</p>
							<p>Si estás seguro que tienes Internet y está respondiendo correctamente y después de 10 minutos el servicio sigue sin responder por favor notifícanos con el widget de asistencia que está abajo a la izquierda</p>
							<p>${error.message}</p>
							`
						} else {
							if(error.error && error.error.message) {
								console.log('Status', error.status);
									errorMessage = `<p>Código de error: ${error.status}</p><p>${error.error.message}</p>`
							} else {
								errorMessage = `<p>Código de error: ${error.status}</p><p>${error.message}</p>`
							}
						}
						if(sendError) {
							Swal.fire({
								type: 'error',
								title: 'Error',
								html: errorMessage
							});
						}
					}
					if(sendError) {
						rollbar.error(new Error(error.message).stack);
					}
					return throwError(errorMessage);
				})
			);
	}

}
