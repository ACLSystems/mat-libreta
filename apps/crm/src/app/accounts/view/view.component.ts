import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from '@crmshared/services/user.service';
import { DtOptions } from '@crmshared/config/config.module';
import { Account } from '@crmshared/types/account.type';

// declare const $: any;

@Component({
	selector: 'mat-libreta-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss']
})
export class ViewAccountsComponent implements OnInit {

	accounts: Account[] = [];
	tableHeader: string[];
	loading: boolean;
	dtOptions = DtOptions;

	constructor(
		private userService: UserService,
		private router: Router
	) {
		this.tableHeader = [
			'Nombre',
			'Razón Social',
			'Tipo',
			'Dueño',
			''
		];
	}

	ngOnInit() {
		this.loading = true;
		this.userService.orgList().subscribe(data => {
			// console.log(data);
			this.accounts = data;
			this.accounts.forEach(acc => {
				if(!acc.owner) {
					acc.owner = {
						_id: '',
						person: {
							name: '',
							fatherName: '',
							motherName: '',
							email: ''
						}
					};
				}
			});
			this.loading = false;
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				title: 'Hubo un error',
				text: error
			})
		});
	}

	createAccount() {
		this.router.navigate(['/accounts/create']);
	}

}
