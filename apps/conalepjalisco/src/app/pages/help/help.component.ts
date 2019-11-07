import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';

import { WindowService } from '@cjashared/services/windowSize.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, AfterViewInit {

	width: number;

  constructor(private windowService: WindowService) { }

  ngOnInit() {
		this.width = this.windowService.windowRef.innerWidth;
  }

	@HostListener('window:resize', ['$event'])
	onResize(event?:any) {
		this.width = this.windowService.windowRef.innerWidth;
	}

	// @HostListener('window:scroll', ['$event'])
	// scrollHandler(event?: any) {
	// 	let pos = document.documentElement.scrollTop;
	// 	let $navbar = document.getElementsByClassName('navbar')[0];
	// 	if(pos > 50){
	// 		$navbar.classList.remove('navbar-transparent');
	// 		$navbar.classList.remove('bg-primary');
	// 		$navbar.classList.add('bg-light');
	// 	} else {
	// 		$navbar.classList.add('navbar-transparent');
	// 		$navbar.classList.remove('bg-light');
	// 		$navbar.classList.add('bg-primary');
	// 	}
	// }

	ngAfterViewInit() {
		let $navbar = document.getElementsByClassName('navbar')[0];
		$navbar.classList.remove('navbar-transparent');
		// $navbar.classList.remove('bg-primary');
		// $navbar.classList.add('bg-white');
	}

}
