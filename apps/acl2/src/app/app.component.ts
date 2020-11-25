import { Component } from '@angular/core';
import {
	ActivatedRoute,
	Router,
	RouterEvent,
	NavigationEnd
} from '@angular/router';

declare let gtag:Function;
declare let fbq:Function;

@Component({
  selector: 'acl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ACL Systems SA de CV';
	params: any;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		this.activatedRoute.queryParams.subscribe(params => {
			this.params = params.hola;
			console.log(this.params);
		});
		this.router.events.subscribe((event: RouterEvent) => {
				if(event instanceof NavigationEnd) {
					gtag('config','UA-76007400-1',{'page_path' : event.url});
					fbq('track', 'PageView');
				}
			});
	}
}
