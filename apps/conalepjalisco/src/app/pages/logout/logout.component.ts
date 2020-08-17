import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@mat-libreta/shared';
import { EnvService } from '@cjashared/services/setEnv.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
		private userService: UserService,
		private envService: EnvService,
		private router: Router
	) { }

  ngOnInit() {
		this.userService.logout().subscribe(() => {
			this.destroySession();
		}, error => {
			console.log(error);
			this.destroySession();
		})

  }

	destroySession() {
		this.userService.destroySession();
		this.envService.setEnvironment();
		// this.router.navigate(['/pages/home']);
		const route = this.router;
		setTimeout(function(){
				route.navigate(['/pages/home']);
		}, 3501);
	}

}
