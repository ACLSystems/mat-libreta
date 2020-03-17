import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router,
	NavigationEnd,
	// NavigationStart
} from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { Subscription, Observable, timer } from 'rxjs';
import { filter } from 'rxjs/operators';

// import { PublicService } from '@wqshared/services/public.service';

@Component({
	selector: 'webquid-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
	private _router: Subscription;
	private intervalReview: Observable<number> = timer(0, 10000);
	private intervalSubscription: Subscription;

	constructor(
		private router: Router,
		private sg: SimpleGlobal
		// private publicService: PublicService
	) {
}

	ngOnInit() {
		this.intervalSubscription = this.intervalReview.subscribe(interval => {
			const now = new Date();
			console.log(now);
		});
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

	ngOnDestroy() {
		this.intervalSubscription.unsubscribe();
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
