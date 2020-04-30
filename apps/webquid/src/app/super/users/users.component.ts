import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { SuperService } from '../services/super.services';

@Component({
  selector: 'mat-libreta-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

	users: any[] = [];
	company: string;
	loading: boolean = false;

  constructor(
		private activatedRoute: ActivatedRoute,
		private superService: SuperService
	) {
		this.activatedRoute.params.subscribe(params => {
			this.company = params.companyid;
		});
	}

  ngOnInit(): void {
		this.loading = true;
		this.superService.searchUsers(this.company).subscribe(data => {
			// console.log(data);
			if(data && Array.isArray(data) && data.length > 0) {
				this.users = data.map(d => {
					return {
						isActive: d.isActive,
						identifier: d.identifier,
						name: (d.person && d.person.name) ? d.person.name : null,
						fatherName:  (d.person && d.person.fatherName) ? d.person.fatherName : null,
						motherName:  (d.person && d.person.motherName) ? d.person.motherName : null,
						email:  (d.person && d.person.email) ? d.person.email : null,
						iniPass: (d.admin && d.admin.initialPassword) ? d.admin.initialPassword : null
					}
				})
			}
			this.loading = false;
		}, error => {
			Swal.fire({
				type: 'error',
				text: 'Hubo un error al descargar los usuarios'
			});
			console.log(error);
		});
  }

}
