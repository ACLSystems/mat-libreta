import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from '@crmshared/services/user.service';
import { CommonService } from '@crmshared/services/common.service';
import { DtOptions } from '@crmshared/config/config.module';
import { Contact } from '@crmshared/classes/contact.class';
import { Account } from '@crmshared/classes/account.class';

@Component({
  selector: 'mat-libreta-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewUserComponent implements OnInit {

	users: Contact[] = [];

	tableHeader: string[];
	loading: boolean;
	dtOptions = DtOptions;

  constructor(
		private userService: UserService,
		private commonService: CommonService,
		private router: Router
	) {
		this.tableHeader = [
			'Email',
			'Nombre',
			'Cuenta(s)',
			'Dueño',
			'Acciones'
		];
	}

  ngOnInit() {
		this.loading = true;
		this.userService.usersList().subscribe(data => {
			if(data && Array.isArray(data) && data.length > 0 ){
				this.commonService.displayLog('data', data);
				data.forEach(d => {
					if(!d.org) {
						d.org = [];
						d.org.push(new Account({}));
					} else {
						if(d.org && Array.isArray(d.org) && d.org.length > 0) {
							let dTemp = [];
							d.org.forEach((o:Account) => {
								dTemp.push(new Account(o));
							})
							d.org = [...dTemp];
						}
					}
					if(!d.owner) {
						d.owner = {
							_id: '',
							person: {
								name: '',
								fatherName: '',
								motherName: '',
								email: ''
							}
						};
					}
					if(!d.happiness) {
						d.happiness = 0;
					}
					this.users.push(new Contact(d));
				});
				this.commonService.displayLog('Usuarios', this.users);
			}
			this.loading = false;
		}, error => {
			Swal.fire({
				type: 'error',
				title: 'Hubo un error',
				text: error
			})
			console.log(error);
		});
  }

	createUser() {
		this.router.navigate(['/users/create'])
	}

}
