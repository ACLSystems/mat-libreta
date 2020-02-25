import { Injectable } from '@angular/core';

import { CommonService, Environment } from '@mat-libreta/shared';
import { environment } from '@cetecenv/environment';

@Injectable({
	providedIn: 'root'
})
export class EnvService {

	constructor(
		private commonService: CommonService
	) {}

	validateEnvironment() {
		const localEnv: Environment = this.commonService.getEnvironment();
		if(localEnv) {
			if(!this.commonService.compareObjects(localEnv, environment)) {
				localStorage.removeItem('environment');
				this.setEnvironment();
			}
		} else {
			this.setEnvironment();
		}
	}

	setEnvironment() {
		this.commonService.setEnvironment({
			instanceName: environment.instanceName,
			instanceRef: environment.instanceRef,
			url: environment.url,
			footerName: environment.footerName,
			footerLink: environment.footerLink,
			colorEvents: environment.colorEvents,
			bank: environment.bank,
			bankAccount: environment.bankAccount,
			bankCLABE: environment.bankCLABE,
			mocAmount: environment.mocAmount
		});
	}

}
