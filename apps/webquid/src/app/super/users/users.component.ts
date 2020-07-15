import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { DtOptions } from '@mat-libreta/shared';

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
	dtOptions = DtOptions;
	tableHeader: string[];

  constructor(
		private activatedRoute: ActivatedRoute,
		private superService: SuperService
	) {
		this.activatedRoute.params.subscribe(params => {
			this.company = params.companyid;
		});
		this.tableHeader = [
			'#',
			'Activo',
			'RFC',
			'Nombre',
			'Email',
			'Password Inicial'
		];
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
						name: (d.person && d.person.name) ? properCase(d.person.name) : null,
						fatherName:  (d.person && d.person.fatherName) ? properCase(d.person.fatherName) : null,
						motherName:  (d.person && d.person.motherName) ? properCase(d.person.motherName) : null,
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
			this.loading = false;
		});
  }

}

function properCase(s:string) {
	if(typeof s !== 'string') return s;
	var word = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
	let arr = word.trim().split(' ');
	if(Array.isArray(arr) && arr.length > 1) {
		// console.log(word);
		let simpleWord = '';
		for(let w of arr) {
			simpleWord += ' ' + properCase(w);
		}
		word = simpleWord.trim();
		// console.log(word);
	}
	// console.log(word);
	if(word === '' || !word) return '.';
	return word;
}
