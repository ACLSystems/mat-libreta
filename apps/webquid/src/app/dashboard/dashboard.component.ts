import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import Swal from 'sweetalert2';

import { UserService } from '@wqshared/services/user.service';
import { Service } from '@wqshared/types/services.type';
import { Identity } from '@wqshared/types/user.type';

registerLocaleData(localeMX);

@Component({
	selector: 'webquid-services',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	providers: [
		{ provide: LOCALE_ID, useValue: 'es-MX'}
	]
})
export class DashboardComponent implements OnInit {

	loading: boolean = false;
	services: Service[] = [];
	identity: Identity;
	email: boolean = false;
	emailNotNow: boolean = false;

	constructor(
		private router: Router,
		private userService: UserService
	) {
		this.identity = this.userService.getidentity();
		// console.group('Identity')
		// console.log(this.identity);
		// console.groupEnd()
	}

	ngOnInit() {
		this.loading = true;
		this.getMyServices();
		this.checkEmail();
	}

	getMyServices() {
		this.userService.getMyServices().subscribe(data => {
			// console.log(data);
			this.services = [...data];
			// console.group('Identity Roles')
			// console.log(this.identity.roles);
			// console.groupEnd()
			// console.group('services')
			// console.log(this.services)
			// console.groupEnd()
			const serviceAll = this.services.filter(item => item.role === '');
			const serviceRequests = this.identity.roles.isRequester ? this.services.filter(item => item.role === 'isRequester') : [];
			this.services = [
				...serviceRequests,
				...serviceAll
			];
			this.loading = false;
		}, error => {
			console.log(error);
		});
	}

	checkEmail() {
		if(this.identity.person && this.identity.person.email) {
			this.email = true;
		}
		if(!this.email && !this.emailNotNow) {
			Swal.fire({
				type: 'question',
				html: 'No tienes registrado un correo electrónico<br>Para poder recibir notificaciones y crear solicitudes debes tener uno.<br>Coloca tu correo electrónico:',
				input: 'email',
				showCancelButton: true,
				cancelButtonColor: 'red',
				cancelButtonText: 'No por ahora'
			}).then(email => {
				if(email.value) {
					Swal.fire('Espera...');
					Swal.showLoading();
					this.userService.addEmail(email.value).subscribe((data) => {
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'success',
							html: 'Tu cuenta ha sido actualizada. Te llegará un correo con instrucciones para validarla'
						});
						// console.log(data);
					}, error => {
						console.log(error);
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'error',
							text: `Hubo un error: ${error.error.message}`
						});
					});
				}
			});
		}
	}

	goToService(serviceid: string) {
		this.router.navigate(['/services',serviceid]);
	}

}
