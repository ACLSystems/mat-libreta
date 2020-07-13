import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SimpleGlobal } from 'ng2-simple-global';
// import { environment } from '@cjaenv/environment';

@Component({
	selector: 'app-privacy',
	templateUrl: './privacy.component.html',
	styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit, AfterViewInit {

	url: string;
	support: string;

	constructor(
		private sg: SimpleGlobal
	) { }

	ngOnInit() {
		this.url = this.sg['environment'].urlLibreta;
		this.support = this.sg['environment'].emailSupport;
	}

	ngAfterViewInit() {
		let $navbar = document.getElementsByClassName('navbar')[0];
		$navbar.classList.remove('navbar-transparent');
		// $navbar.classList.remove('bg-primary');
		// $navbar.classList.add('bg-white');
	}

}
