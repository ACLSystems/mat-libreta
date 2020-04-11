import { Component, OnInit } from '@angular/core';
import { Router,
	NavigationEnd,
	// NavigationStart
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

	constructor(
		private router: Router
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
	}

}
