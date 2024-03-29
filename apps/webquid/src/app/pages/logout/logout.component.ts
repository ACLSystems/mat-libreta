import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@wqshared/services/user.service';

@Component({
  selector: 'webquid-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
		private userService: UserService,
		private router: Router
	) { }

  ngOnInit() {
		this.userService.destroySession();
		// this.router.navigate(['/pages/home']);
		const ruta = this.router;
		setTimeout(function(){
				ruta.navigate(['/pages/home']);
		}, 3501);
  }

}
