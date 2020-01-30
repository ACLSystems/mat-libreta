import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService,CommonService } from '@mat-libreta/shared';
import { environment } from '@cetecenv/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
		private userService: UserService,
		private commonService: CommonService,
		private router: Router
	) { }

  ngOnInit() {
		this.userService.destroySession();
		this.setEnvironment();
		// this.router.navigate(['/pages/home']);
		const ruta = this.router;
		setTimeout(function(){
				ruta.navigate(['/pages/home']);
		}, 3501);
  }

	setEnvironment() {
		this.commonService.setEnvironment({
			instanceName: environment.instanceName,
			url: environment.url,
			footerName: environment.footerName,
			footerLink: environment.footerLink,
			colorEvents: environment.colorEvents
		});
	}

}
