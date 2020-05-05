import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { OperService } from '../services/oper.services';


@Component({
  selector: 'mat-libreta-users-by-company',
  templateUrl: './users-by-company.component.html',
  styleUrls: ['./users-by-company.component.scss']
})
export class UsersByCompanyComponent implements OnInit {

	users: any[] = [];
	company: string;
	companyName: string;
	loading: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private operService: OperService
	) {
		this.activatedRoute.params.subscribe(params => {
			this.company = params.companyid;
		});
		this.companyName = this.router.getCurrentNavigation().extras.state.companyName;
		if(this.company == '' || !this.company) {
			this.router.navigate(['/oper']);
		}
	}

	ngOnInit(): void {
		this.loading = true;
		this.operService.searchUsersByCompany(this.company).subscribe(data => {
			console.log(data);
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
			} else {
				Swal.fire({
					type: 'warning',
					text: `No hay usuarios para ${this.companyName}`
				});
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
