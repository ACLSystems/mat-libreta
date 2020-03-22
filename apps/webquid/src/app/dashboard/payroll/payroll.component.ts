import { Component, OnInit } from '@angular/core';
import { Identity } from '@wqshared/types/user.type';

import { UserService } from '@wqshared/services/user.service';

@Component({
	selector: 'webquid-payroll',
	templateUrl: './payroll.component.html',
	styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {

	identity: Identity;
	userTag: string;

	constructor(
		private userService: UserService
	) {
		this.identity = this.userService.getidentity();
		if(this.identity.person) {
			this.userTag = `${this.identity.person.name} ${this.identity.person.fatherName} ${this.identity.person.motherName}`
		} else {
			this.userTag = `${this.identity.identifier}`
		}
	}

	ngOnInit() {
	}

	main() {

	}

}
