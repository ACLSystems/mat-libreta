import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CommonService } from '@mat-libreta/shared';
import { environment } from '@cetecenv/environment';

@Component({
	selector: 'mat-cetec-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	private _router: Subscription;

	constructor(
		private router: Router,
		private commonService: CommonService
	) {
		this.commonService.setEnvironment({
			instanceName: environment.instanceName,
			url: environment.url,
			footerName: environment.footerName,
			footerLink: environment.footerLink,
			colorEvents: environment.colorEvents
		});
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
