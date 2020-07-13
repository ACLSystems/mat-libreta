import { Component, OnInit } from '@angular/core';

import { SimpleGlobal} from 'ng2-simple-global';

import { CommonService } from '@mat-libreta/shared';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	public year:number;
	footerName: string;
	footerLink: string;
	vendorName: string = 'ACL Systems SA de CV';
	vendorLink: string = 'https://aclsystems.mx';

	constructor(
		private sg: SimpleGlobal,
		private commonService: CommonService
	) { }

	ngOnInit() {
		let now = new Date();
		this.year = now.getFullYear();
		const instance = this.sg['instance'];
		if(!instance) {
			this.commonService.getCurrentEnvironment.subscribe(() => {
				this.setInstance();
			})
		} else {
			this.setInstance();
		}
	}

	setInstance() {
		const instance = this.sg['instance'];
		// console.log('Instance');
		// console.log(instance);
		this.footerLink = instance.footer?.link;
		this.footerName = instance.footer?.name;
		if(instance.vendor?.name) this.vendorName = instance.vendor.name;
		if(instance.vendor?.link) this.vendorLink = instance.vendor.link;
		// console.log('FooterName',this.footerName);
	}

}
