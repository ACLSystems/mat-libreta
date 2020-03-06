import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';

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

	main: boolean = true;
	services: boolean[];
	subscription: Subscription;

	constructor(
		private router: Router
	) {
	}

	ngOnInit() {
	}

	goToPayroll() {
		this.router.navigate(['/services/payroll'])
	}

	goToIMSS() {
		this.router.navigate(['/services/imss'])
	}
	goToVacation() {
		this.router.navigate(['/services/vacation'])
	}
	goToCertificates() {
		this.router.navigate(['/services/certificates'])
	}
	goToOther() {
		this.router.navigate(['/services/other'])
	}



}
