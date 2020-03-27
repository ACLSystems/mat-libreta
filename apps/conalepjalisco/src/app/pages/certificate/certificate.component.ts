import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { interval, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
//import { TimeagoIntl } from 'ngx-timeago';
import localeMx from '@angular/common/locales/es-MX';
import Swal from 'sweetalert2';
//import { strings as spanishStrings } from 'ngx-timeago/language-strings/es';

registerLocaleData(localeMx, 'es-Mx');

import { Identity, UserService } from '@mat-libreta/shared';

import { PagesService } from '../pages.service';

import { environment } from '@cjaenv/environment';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
	providers: [ { provide: LOCALE_ID, useValue: 'es-Mx'}]
})
export class CertificateComponent implements OnInit {

	public identity: Identity;
	public captchaSiteKey: string;
	public instanceTitle: string;

	buscando: boolean;
	messageError: string;
	busqueda: boolean;
	updateDisable: boolean;
	secondsDisable: number;
	segundos: number;
	captchaValidated: boolean;
	captchaError: boolean;
	captchaErrorMessage: string;
	certificate: {
		courseName: string,
		courseImage: string,
		courseDuration: number,
		courseDurationUnits: string,
		courseBeginDate: any,
		courseEndDate: any,
		studentName: string,
		finalGrade: number,
		passDate: any,
		certificateNumber: number
	}
	certificateFound: boolean;
	private updateDisableSubscription: Subscription;
	color: string;
	noCert: boolean = false;
	name: string;

  constructor(
		private pagesService: PagesService,
		private userService: UserService,
		//intl: TimeagoIntl
	) {
		// intl.strings = spanishStrings;
		// intl.changes.next();
		this.captchaSiteKey = environment.captchaSiteKey;
		this.instanceTitle = environment.instanceTitle;
		this.color = environment.color;
	}

  ngOnInit() {
		this.buscando = false;
		this.certificateFound = false;
		this.busqueda = false;
		this.updateDisable = false;
		this.captchaValidated = false;
		this.captchaErrorMessage = '';
		this.captchaError = false;
		this.identity = this.userService.getidentity();
  }

	searchCertificate(folio:number) {
		this.secondsDisable = 10000; // 10 segundos
		this.segundos = 10; // 10 veces
		const secondsCounter = interval(this.secondsDisable / this.segundos); // Intervalo que va a contar con intervalos de un segundo
		let numero = 9; // veces + 1 que vamos a contar
		const timer$ = timer(this.secondsDisable); // este va a servir para deshabilitar la suscripción secondsCounter
		this.updateDisableSubscription = interval(this.secondsDisable).subscribe(() => {
			this.updateDisable = false;
			this.updateDisableSubscription.unsubscribe();
		})
		secondsCounter.pipe(takeUntil(timer$)).subscribe( n => this.segundos = numero - n);
		this.name = '';
		this.buscando = true;
		this.certificateFound = false;
		this.messageError = '';
		this.busqueda = false;
		this.pagesService.getCertificate(folio).subscribe((data:any) => {
			if(data) {
				let message = data.message;
				//console.log(message);
				if(data.noCert) {
					Swal.fire({
						type: 'warning',
						html: `<h4>${data.studentName}</h4> ${data.message}`
					});
					this.messageError = data.message;
					this.certificateFound = false;
					this.busqueda = true;
					if(data.studentName) {
						this.name = data.studentName;
					}
				} else {
					this.certificate = {
						courseName: message.courseName,
						courseImage: message.courseImage,
						courseDuration: message.courseDuration,
						courseDurationUnits: message.courseDurationUnits,
						courseBeginDate: new Date(message.courseBeginDate),
						courseEndDate: new Date(message.courseEndDate),
						studentName: message.studentName,
						finalGrade: message.finalGrade,
						passDate: new Date(message.passDate),
						certificateNumber: folio
					}
					this.certificateFound = true;
				}
			}
			this.updateDisable = true;
			this.buscando = false;
			this.busqueda = true;
		}, error => {
			console.log(error);
			this.buscando = false;
			this.certificateFound = false;
			this.updateDisable = false;
			this.messageError = 'La busqueda arrojó un error';
			Swal.fire({
				type: 'error',
				text: this.messageError
			});
			this.messageError = '';
		});
	}

	resolved(captchaResponse: string) {
		if(captchaResponse){
			this.pagesService.captcha(captchaResponse).subscribe((res:any) => {
				// console.log(res);
				if(res && res.success) {
					this.captchaValidated = true;
				} else {
					this.captchaErrorMessage = 'Error con reCaptcha. Favor de intentar nuevamente';
					this.captchaError = true;
				}
			});
		} else {
			this.captchaValidated = false;
		}
	}

}
