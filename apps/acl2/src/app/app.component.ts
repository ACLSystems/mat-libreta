import { Component } from '@angular/core';
import {
	Router,
	RouterEvent,
	NavigationStart,
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

	constructor(
		private router: Router
	) {
		const siteName = document.location.hostname;
		if(siteName.includes('emprendedor')) {
			this.router.navigate(['/empaudaz']);
		}
		this.router.events.subscribe((event: RouterEvent) => {
				if(event instanceof NavigationEnd) {
					gtag('config','UA-76007400-1',{'page_path' : event.url});
					fbq('track', 'PageView');
				}
			});
	}
}
