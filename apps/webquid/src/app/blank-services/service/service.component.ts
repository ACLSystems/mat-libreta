import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import {
	Service
} from '@wqshared/types/services.type';
import {
	Identity
} from '@wqshared/types/user.type';
import {
	UserService
} from '@wqshared/services/user.service';

@Component({
  selector: 'mat-libreta-blank-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

	service: Service;
	serviceid: string;
	loading: boolean = false;
	identity: Identity;

  constructor(
		private activatedRoute: ActivatedRoute,
		private userservice: UserService,
		private router: Router
	) {
		this.loading = true;
		this.activatedRoute.params.subscribe(params => {
			this.serviceid = params.serviceid
		});
	}

  ngOnInit(): void {
		this.identity = this.userservice.getidentity();
		this.getService(this.serviceid);
	}

	getService(serviceid:string) {
		this.userservice.getService(serviceid).subscribe(data => {
			this.service = Object.assign({},data);
			this.loading = false;
			// console.group('service')
			// console.log(this.service)
			// console.groupEnd()
		}, error => {
			Swal.fire({
				type: 'error',
				text: 'Hubo un error en la carga del servicio'
			});
			console.log(error);
			this.router.navigate(['/services']);
		});
	}

	goBack() {
		this.router.navigate(['/services']);
	}

}
