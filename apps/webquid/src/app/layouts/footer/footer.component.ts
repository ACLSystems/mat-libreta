import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'webquid-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	public year:number;

	constructor() { }

	ngOnInit() {
		let now = new Date();
		this.year = now.getFullYear();
	}

}
