import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'acl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ACL Systems';
	year: string;

	constructor() {
		this.year = new Date().getFullYear().toString();
	}

	@HostListener('window:scroll', ['$event'])
	scrollHandler(event?:any) {
		let pos = document.documentElement.scrollTop;
		let $navbar = document.getElementsByClassName('navbar')[0];
		if(pos > 260){
			$navbar.classList.remove('navbar-transparent');
			// $navbar.classList.remove('bg-primary');
			// $navbar.classList.add('bg-light');
		} else {
			$navbar.classList.add('navbar-transparent');
			// $navbar.classList.remove('bg-light');
			// $navbar.classList.add('bg-primary');
		}
	}

}
