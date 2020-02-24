import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PublicService } from '@mat-libreta/shared';

@Component({
	selector: 'webquid-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	private _router: Subscription;

	constructor(
		private router: Router,
		private publicService: PublicService
	) {
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
		// this.getLanguages();
	}

	// getLanguages() {
	// 	this.publicService.getLanguages().subscribe(data => {
	// 		localStorage.setItem('languages',JSON.stringify(data));
	// 		const defaultLanguage: string = localStorage.getItem('defaultLanguage');
	// 		if(!defaultLanguage) {
	// 			let findDefaultLanguage = data.find(lang => lang.default === true);
	// 			if(findDefaultLanguage) {
	// 				localStorage.setItem('defaultLanguage',JSON.stringify(findDefaultLanguage));
	// 			}
	// 		}
	// 	});
	// }
}
