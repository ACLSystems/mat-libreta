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
	accessToken: '2b78154c4b0f47828fc3efd23cb38b2e',
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
					// console.log(error);
					if(error.error instanceof ErrorEvent) {
						// client-side error
						errorMessage = `Error: ${error.error.message}`;
					} else {
						// server-side error
						// console.log(error);
						if(error.error && error.error.message) {
							errorMessage = `<p>Código de error: ${error.status}</p><p>${error.error.message}</p>`
						} else {
							errorMessage = `<p>Código de error: ${error.status}</p><p>${error.message}</p>`
						}
						if(error.error.errors) {
							let e = error.error.errors;
							if(Array.isArray(e)) {
								e.forEach(er => {
									if(er.value) {
										errorMessage = errorMessage + `<p><b>${er.value}</b> ${er.msg}</p>`
									}
								});
							}
						}
						if(error.status > 399 && error.status < 500) {
							sendError = false;
						}
					}
					Swal.fire({
						type: 'error',
						title: 'Ha ocurrido un error',
						html: errorMessage
					});
					if(sendError) {
						rollbar.error(new Error(error.message).stack);
					}
					return throwError(errorMessage);
				})
			);
	}

}
