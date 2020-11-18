import {
	Component,
	ElementRef,
	ViewChild,
	OnInit,
	AfterViewInit
} from '@angular/core';
import {
	// Router,
	ActivatedRoute
} from '@angular/router';

declare let Calendly:any;

@Component({
  selector: 'mat-libreta-us',
  templateUrl: './us.component.html',
  styleUrls: ['./us.component.css']
})

export class UsComponent implements OnInit, AfterViewInit {

	private fragment: string;
	@ViewChild('calendlyContainer') calendlyContainer: ElementRef;

  constructor(
		// private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.route.fragment.subscribe(fragment => {
			this.fragment = fragment;
		})
  }

  ngAfterViewInit() {
		Calendly.initInlineWidget({
			url: 'https://calendly.com/ventasacl',
			parentElement: this.calendlyContainer.nativeElement
		});
		try {
			document.querySelector('#' + this.fragment).scrollIntoView();
		} catch (e) {}
  }

}
