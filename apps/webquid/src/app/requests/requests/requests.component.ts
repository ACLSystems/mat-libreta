import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from '@wqshared/services/user.service';

@Component({
  selector: 'webquid-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

	requests: any[] = [];
	loading: boolean = false;

  constructor(
		private userService: UserService,
		private router: Router
	) {

	}

  ngOnInit(): void {
		this.loading = true;
		this.getMyRequests();
  }

	getMyRequests() {
		this.userService.getMyRequests().subscribe(data => {
			if(data) {
				this.requests = [...data];
			}
			this.loading = false;
		}, error => {
			console.log(error);
			this.loading = false;
			Swal.fire({
				type: 'error',
				text: 'Hubo un error al intentar recobrar las solicitudes. Intenta más tarde. Si esto persiste en varias ocasiones favor de reportarlo'
			});
			this.router.navigate(['/services']);
		})
	}

}
