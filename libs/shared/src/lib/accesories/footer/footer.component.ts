import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../services/common.service';

@Component({
	selector: 'app-shared-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class SharedFooterComponent implements OnInit {
	public year:number;

	footerName: string;
	footerLink: string;

	constructor(
		private commonService: CommonService
	) {
		this.footerName = this.commonService.getEnvironment().footerName;
		this.footerLink = this.commonService.getEnvironment().footerLink;
	}

	ngOnInit() {
		let now = new Date();
		this.year = now.getFullYear();
	}

}
