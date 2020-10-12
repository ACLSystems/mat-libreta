import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import Swal from 'sweetalert2';

import {
	DtOptions,
	// CommonService
} from '@mat-libreta/shared';

import { SuperService } from '../services/super.services';

registerLocaleData(localeEs,'es-MX');

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
		private superService: SuperService,
		// private commonService: CommonService
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
			'Password Inicial',
			'Fecha Ant',
			'Años',
			'Días',
			'Historial'
		];
	}

  ngOnInit(): void {
		this.loading = true;
		this.superService.searchUsers(this.company).subscribe(data => {
			console.log(data);
			if(data && Array.isArray(data) && data.length > 0) {
				this.users = data.map(d => {
					const c = d.companies.find(comp => comp.company._id + '' === this.company + '');
					var obj =  {
						isActive: d.isActive,
						identifier: d.identifier,
						name: (d.person && d.person.name) ? properCase(d.person.name) : null,
						fatherName:  (d.person && d.person.fatherName) ? properCase(d.person.fatherName) : null,
						motherName:  (d.person && d.person.motherName) ? properCase(d.person.motherName) : null,
						email:  (d.person && d.person.email) ? d.person.email : null,
						iniPass: (d.admin && d.admin.initialPassword) ? d.admin.initialPassword : null,
						beginDate: null,
						vacationHistory: [],
						vacations: {}
					}
					if(c && c.beginDate) {
						obj.beginDate = c.beginDate;
					}
					if(c && c.vacationHistory) {
						obj.vacationHistory = c.vacationHistory;
					}
					if(c && c.vacations) {
						obj.vacations = c.vacations;
					}
					return obj;
				});
				console.log(this.users);
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
