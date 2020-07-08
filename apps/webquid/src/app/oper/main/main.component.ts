import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { OperService } from '../services/oper.services';
import { CommonService } from '@mat-libreta/shared';

import { UserComponent } from '../user/user.component';
import { CompanyComponent } from '../company/company.component';
import { CreatecompanyComponent } from '../createcompany/createcompany.component';
import { CreateuserComponent } from '../createuser/createuser.component';

import { DtOptions } from '@mat-libreta/shared';

declare const $:any;

@Component({
  selector: 'webquid-oper-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

	loading: boolean = false;
	searchForm = this.fb.group({
		search: ['']
	});
	companiesToggle		: boolean = true;
	usersToggle				: boolean = true;
	companiesHasResult: boolean = false;
	usersHasResult		: boolean = false;

	companiesResult		: any[] = [];
	usersResult				: any[] = [];
	companiesResultMessage: string = '';
	usersResultMessage: string = '';
	tableHeaderCompany: string[];
	tableHeaderUsers: string[];
	dtOptions = DtOptions;
	excelData: any[] = [];
	progress: string = '0';
	progressStyle: string = 'width: 0%;';
	progressColor: string = 'bg-success';
	errors: any[] = [];
	success: any[] = [];

  constructor(
		private router: Router,
		private fb: FormBuilder,
		private operService: OperService,
		private commonService: CommonService,
		public matDialog: MatDialog
	) {
		this.tableHeaderCompany = [
			'#',
			'RFC',
			'Razón Social',
			'Nombre Comercial',
			'Usuarios'
		];

		this.tableHeaderUsers = [
			'#',
			'RFC',
			'Nombre',
			'Email',
			'Empresas'
		];
	}

  ngOnInit(): void {

  }

	ngOnDestroy() {
	}

	goToHome() {
		this.router.navigate(['/services']);
	}
	goToMassiveEmail() {
		this.router.navigate(['/oper/massive']);
	}

	goToDeliveries() {
		this.router.navigate(['/oper/deliveries']);
	}

	changeComp() {
		this.companiesToggle = !this.companiesToggle;
		if(!this.usersToggle && !this.companiesToggle) {
			this.usersToggle = !this.usersToggle;
		}
		// console.log('companiesToggle: ',this.companiesToggle, 'usersToggle: ',this.usersToggle);
	}

	changeUser() {
		this.usersToggle = !this.usersToggle;
		if(!this.usersToggle && !this.companiesToggle) {
			this.companiesToggle = !this.companiesToggle;
		}
		// console.log('companiesToggle: ',this.companiesToggle, 'usersToggle: ',this.usersToggle);
	}



	search() {
		// console.log(this.searchForm.get('search').value);
		// console.log('companiesToggle: ',this.companiesToggle, 'usersToggle: ',this.usersToggle);
		this.companiesHasResult = false;
		this.usersHasResult = false;
		this.companiesResultMessage = '';
		this.usersResultMessage = '';
		let searchValue = this.searchForm.get('search').value;
		if(searchValue === '') {
			Swal.fire({
				type: 'warning',
				text: 'Define un criterio de búsqueda'
			});
			return;
		}
		if(searchValue.length < 3) {
			Swal.fire({
				type: 'warning',
				text: 'Al menos ingresa 3 caracteres'
			});
			return;
		}
		if(this.companiesToggle) {
			this.operService.searchCompanies(searchValue).subscribe(data => {
				// console.log(data);
				if(data && data.message && data.message.includes('No existen empresas')) {
					// this.companiesToggle = false;
					this.companiesResultMessage = data.message;
				} else {
					this.companiesResult = [...data];
				}
				this.companiesHasResult = true;
			}, error => {
				console.log(error);
			});
		}
		if(this.usersToggle) {
			this.operService.searchUsers(searchValue).subscribe(data => {
				this.commonService.displayLog('Resultados Usuarios',data);
				if(data && data.message && data.message.includes('La búsqueda no arrojó usuarios')) {
					this.usersResultMessage = data.message;
					// this.usersToggle = false;
				} else {
					this.usersResult = [...data];
				}
				this.usersHasResult = true;
			}, error => {
				console.log(error);
			});
		}
	}

	openUserModal(index:string) {
		const userModalDialog = this.matDialog.open(UserComponent, {
			// disableClose: false,
			id: 'editUser',
			height: '495px',
			width: '900px',
			data: this.usersResult[index]
		});
	}

	createUserModal() {
		const createuserModalDialog = this.matDialog.open(CreateuserComponent, {
			// disableClose: false,
			id: 'createUser',
			height: '495px',
			width: '900px'
		});
	}

	createCompanyModal() {
		const createcompanyModalDialog = this.matDialog.open(CreatecompanyComponent, {
			// disableClose: false,
			id: 'createCompany',
			height: '495px',
			width: '900px'
		});
	}

	openCompanyModal(id:string) {
		const companyModalDialog = this.matDialog.open(CompanyComponent, {
			// disableClose: false,
			id: 'editCompany',
			height: '594px',
			width: '900px',
			data: {id}
		});
	}

	goToCompany(id:string) {
		this.router.navigate(['/oper/company',id]);
	}

	goUsersByCompany(id:string,companyName: string) {
		this.router.navigate(['/oper/company',id,'users'], {state:{companyName}});
	}


}
