import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Block } from '@cetecshared/types/block.type';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

	loading: boolean;
	blockData: Block;
	today: Date;

  constructor(
		private router: Router
	) { }

  ngOnInit() {
		this.loading = true;
		const data = JSON.parse(localStorage.getItem('tempBlock'));
		if(data) {
			this.blockData = data;
			localStorage.removeItem('tempBlock');
			setTimeout(() => {
				this.loading = false;
			}, 2000);
		} else {
			this.router.navigate(['/']);
		}
  }

}
