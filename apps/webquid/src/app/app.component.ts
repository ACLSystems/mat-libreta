import { Component, OnInit } from '@angular/core';
import {
	Router,
	RouterEvent,
	NavigationEnd,
	NavigationStart
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// import { PublicService } from '@wqshared/services/public.service';

@Component({
	selector: 'webquid-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	private _router: Subscription;
	loading: boolean = false;

	constructor(
		private router: Router
	) {
		this.router.events.subscribe((event: RouterEvent): void => {
			if(event instanceof NavigationStart) {
				// console.log('Comenzando navegación');
				this.loading = true;
			} else if(event instanceof NavigationEnd) {
				// console.log('Terminando navegación');
				this.loading = false;
			}
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
