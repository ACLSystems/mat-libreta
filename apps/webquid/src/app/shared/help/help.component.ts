import { Component, OnInit } from '@angular/core';

import { Identity, Roles } from '@wqshared/types/user.type';
import { CommonService } from '@wqshared/services/common.service';

@Component({
  selector: 'webquid-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

	loading: boolean = false;
	identity: Identity = null;
	roles: Roles = null;
	publicUser: boolean = true;

  constructor(
		private commonService: CommonService
	) {
		this.identity = commonService.getidentity();
		if(this.identity) {
			this.roles = this.identity.roles;
			this.publicUser = false;
		} else {
			this.publicUser = true;
		}
	}

  ngOnInit(): void {
  }

}
