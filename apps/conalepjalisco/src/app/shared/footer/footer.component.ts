import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-shared-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class SharedFooterComponent implements OnInit {
	public year:number;

	constructor() { }

	ngOnInit() {
		let now = new Date();
		this.year = now.getFullYear();
	}

}
