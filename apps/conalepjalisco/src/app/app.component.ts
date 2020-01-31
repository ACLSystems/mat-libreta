import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CommonService, Environment } from '@mat-libreta/shared';
import { environment } from '@cjaenv/environment';

@Component({
  selector: 'mat-cjal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	private _router: Subscription;

	constructor(
		private router: Router,
		private commonService: CommonService
	) {
		const localEnv: Environment = this.commonService.getEnvironment();
		if(localEnv) {
			if(localEnv.instanceName !== environment.instanceName) {
				localStorage.removeItem('environment');
				this.setEnvironment();
			} else {
				// console.log('Ambiente persiste');
			}
		} else {
			this.setEnvironment();
		}
	}

	ngOnInit() {
		this._router = this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
			const body = document.getElementsByTagName('body')[0];
			const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
			if (body.classList.contains('modal-open')) {
				body.classList.remove('modal-open');
				modalBackdrop.remove();
			}
		});
	}

	setEnvironment() {
		this.commonService.setEnvironment({
			instanceName: environment.instanceName,
			url: environment.url,
			footerName: environment.footerName,
			footerLink: environment.footerLink,
			colorEvents: environment.colorEvents,
			bank: environment.bank,
			bankAccount: environment.bankAccount,
			bankCLABE: environment.bankCLABE
		});
	}
}
