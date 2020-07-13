import { Injectable } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';

import { CommonService, PublicService, Environment } from '@mat-libreta/shared';
import { environment } from '@cjaenv/environment';

@Injectable({
	providedIn: 'root'
})
export class EnvService {

	constructor(
		private commonService: CommonService,
		private publicService: PublicService,
		private sg: SimpleGlobal
	) {}

	validateEnvironment() {
		const localEnv: Environment = this.commonService.getEnvironment();
		if(localEnv) {
			if(!this.commonService.compareObjects(localEnv, environment)) {
				// localStorage.removeItem('environment');
				this.setEnvironment();
			} else {
				this.commonService.sendCurrentEnvironment('Ambiente listo');
			}
		} else {
			this.setEnvironment();
		}
	}

	setEnvironment() {
		this.publicService.getInstance(environment.url).subscribe((data:any) => {
			this.sg['instance'] = data;
			// console.log('data');
			// console.log(data);
			localStorage.setItem('url',environment.url);
			this.commonService.setEnvironment({
				hostname: data.hostname,
				instanceName: data.instance.name,
				orgName: data.organization,
				instanceRef: data.instance.ref,
				url: data.url.api + '/',
				urlLibreta: data.url.libreta,
				footerName: data.footer.name,
				footerLink: data.footer.link,
				colorEvents: [...data.color.events],
				bank: data.bank.name,
				bankAccount: data.bank.account,
				bankCLABE: data.bank.CLABE,
				mocAmount: data.platform.moocAmount,
				platform: data.platform.type,
				production: environment.production,
				backOffice: data.backOffice
			});
		}, error => {
			console.log(error);
		});
	}
}
