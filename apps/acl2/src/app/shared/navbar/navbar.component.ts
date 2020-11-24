import {
	Component,
	OnInit,
	AfterViewInit
} from '@angular/core';
import {
	Router,
	ActivatedRoute,
	NavigationEnd
} from '@angular/router';

@Component({
  selector: 'acl-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit {

	private fragment: string;

	constructor(
		public router: Router,
		private route: ActivatedRoute
	) {
		this.router.events.subscribe(s => {
			if(s instanceof NavigationEnd) {
				const tree = router.parseUrl(router.url);
				if(tree.fragment) {
					const element = document.querySelector("#" + tree.fragment);
					if(element) element.scrollIntoView(true);
				}
			}
		});
	}

	ngOnInit(): void {
		this.route.fragment.subscribe(fragment => {
			this.fragment = fragment;
		})
  }

	ngAfterViewInit() {
		try {
			document.querySelector('#' + this.fragment).scrollIntoView();
		} catch (e) {}
	}

}
