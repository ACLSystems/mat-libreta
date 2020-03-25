import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';

import { UserService } from '@wqshared/services/user.service';
import { Service } from '@wqshared/types/services.type';

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

	constructor(
		private router: Router,
		private userService: UserService
	) {

	}

	ngOnInit() {
		this.loading = true;
		this.getMyServices();
	}

	getMyServices() {
		this.userService.getMyServices().subscribe(data => {
			console.log(data);
			this.services = [...data];
			this.loading = false;
		}, error => {
			console.log(error);
		});
	}

	goToService(serviceid: string) {
		this.router.navigate(['/services',serviceid]);
	}

}
