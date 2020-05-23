import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';

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

	constructor(
		private router: Router,
		private userService: UserService
	) {
		this.identity = this.userService.getidentity();
	}

	ngOnInit() {
		this.loading = true;
		this.getMyServices();
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

	goToService(serviceid: string) {
		this.router.navigate(['/services',serviceid]);
	}

}
