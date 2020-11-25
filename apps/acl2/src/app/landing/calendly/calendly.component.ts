import { Component, OnInit } from '@angular/core';
import {
	ActivatedRoute,
	Router,
	RouterEvent,
	NavigationEnd
} from '@angular/router';

declare let gtag:Function;
declare let fbq:Function;

export interface Calendly {
	event_tupe_name: string;
	event_type_uuid: string;
	event_start_time: string;
	event_end_time: string;
	invitee_uuid: string;
	invitee_first_name: string;
	invitee_last_name: string;
	invitee_full_name: string;
	invitee_payment_amount?: string;
	invitee_payment_currency?: string;
	utm_source?: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_content?: string;
	utm_term?: string;
}

@Component({
  selector: 'mat-libreta-calendly',
  templateUrl: './calendly.component.html',
  styleUrls: ['./calendly.component.css']
})
export class CalendlyComponent implements OnInit {

	calendly: Calendly;
	loading: boolean = false;

  constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		this.activatedRoute.queryParams.subscribe(params => {
			const keys = Object.keys(params);
			if(keys.length) {
				this.calendly = params as Calendly;
				console.group('Desde Query Params');
				console.log(params);
			} else {
				this.router.navigate['/home'];
			}
		});
		this.router.events.subscribe((event: RouterEvent) => {
				if(event instanceof NavigationEnd) {
					gtag('config','UA-76007400-1',{'page_path' : event.url});
					fbq('track', 'PageView');
				}
			});
	}

  ngOnInit(): void {
		this.loading = true;
  }

}
