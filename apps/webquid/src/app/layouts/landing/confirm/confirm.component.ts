import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from '@wqshared/services/user.service';

@Component({
	selector: 'mat-libreta-confirm',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

	token: string;
	email: string;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userService: UserService
	) {
		this.activatedRoute.params.subscribe(params => {
			this.token= params.tokentemp;
			this.email= params.username;
		});
	}

	ngOnInit(): void {
		if(this.token && this.email) {
			this.userService.confirmEmail(this.email,this.token)
				.subscribe(data => {
					const type = data.message.includes('Cuenta confirmada') ? 'success' : 'warning';
					Swal.fire({
						type: type,
						text: data.message
					});
					this.router.navigate(['/pages/home']);
			}, error => {
				Swal.fire({
					type: 'warning',
					text: 'Esta liga no puede usarse para ingresar. Te direccionamos a la página principal'
				});
				this.router.navigate(['/pages/home']);
			});
		} else {
			Swal.fire({
				type: 'warning',
				text: 'Esta liga no puede usarse para ingresar. Te direccionamos a la página principal'
			});
			this.router.navigate(['/pages/home']);
		}
	}

}
