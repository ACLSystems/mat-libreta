import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { EnvService } from '@cetecshared/services/setEnv.service';
import { BrowerService, CommonService } from '@mat-libreta/shared';

@Component({
	selector: 'mat-cetec-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	private _router: Subscription;
	private browser: any;

	constructor(
		private router: Router,
		private envService: EnvService,
		private browserService: BrowerService,
		private commonService: CommonService
	) {
		this.envService.validateEnvironment();
		this.browser = this.browserService.detectBrowser();
		this.commonService.displayLog('Browser',this.browser);
		if(this.browser && this.browser.deviceInfo && this.browser.deviceInfo.browser != 'Chrome') {
			Swal.fire({
				type: 'warning',
				html: '<img src="assets/img/chrome-logo.svg"><p>Este sitio está optimizado para navegadores Google Chrome de última generación.<br>Para una mejor experiencia te recomendamos utilices Google Chrome si vas a ingresar a este sitio. <br>Puedes descargar Chrome <a href="https://www.google.com.mx/chrome">aquí</a></p>'
			});
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
}
