import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { UserService } from '../services/users.service';

import {
	CommonService
} from '@mat-libreta/shared';

@Component({
	selector: 'mat-libreta-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

	loading: boolean = false;
	user: any = false;
	userGroups: any = false;

	constructor(
		private userService: UserService,
		private commonService: CommonService
	) {}

	ngOnInit(): void {}

	getUser() {
		this.user = false;
		Swal.fire({
			title: 'Correo del usuario',
			text: 'Por favor, ingresa el correo del usuario',
			inputPlaceholder: 'Correo del usuario',
			input: 'email',
		}).then(email => {
			if(email.value) {
				Swal.fire({
					text: 'Espera...',
					allowOutsideClick: () => !Swal.isLoading()
				});
				Swal.showLoading();
				this.userService.getUser(email.value).subscribe(data => {

					if(data.message && data.message.includes('does not exist')) {
						Swal.fire({
							type: 'warning',
							text: 'Usuario ingresado no existe'
						});
						return;
					}
					this.user = data;
					this.commonService.displayLog('Usuario',this.user);
					this.userService.getUserGroups(email.value).subscribe(data => {
						Swal.hideLoading();
						Swal.close();
						if(data.message && typeof data.message === 'string' && data.message.includes('Usuario no existe')) {
							Swal.fire({
								type: 'warning',
								text: 'Usuario ingresado no existe'
							});
							return;
						}
						this.userGroups = [...data.message?.groups];
						this.commonService.displayLog('Grupos',this.userGroups);
					}, error => {
						Swal.hideLoading();
						Swal.close();
						console.log(error);
						Swal.fire({
							type: 'error',
							text: `Hubo un error: ${error.message}`
						})
					})
				}, error => {
					Swal.hideLoading();
					Swal.close();
					console.log(error);
					Swal.fire({
						type: 'error',
						text: `Hubo un error: ${error.message}`
					})
				})
			}
		})
	}
}
