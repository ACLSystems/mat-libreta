import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
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
		this.reset();
	}

  ngOnInit(): void {

  }

	ngOnDestroy() {
	}

	goToHome() {
		this.router.navigate(['/services'])
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

	onFileChange(event:any) {
		this.commonService.displayLog('File Event trigger','Success');
		const target: DataTransfer = <DataTransfer>(event.target);
		if(target.files.length !== 1) {
			Swal.fire({
				type: 'error',
				text: 'Solo puede procesarse un archivo a la vez'
			});
			return;
		}
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			console.log('Estoy aquí!')
			/* Leer el archivo */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			/* Traemos la primera hoja (sheet) */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

			/* Listo... tenemos los datos */
			this.excelData = convertToArray(XLSX.utils.sheet_to_json(ws,{header:1}));
			this.commonService.displayLog('Excel',this.excelData);
		};
		reader.readAsBinaryString(target.files[0]);
	}

	// runLoading() {
	// 	const len = this.excelData.length;
	// 	this.excelData.forEach((itr,index) => {
	// 		setTimeout(() => {
	// 			this.operService.addUserEmail(itr.identifier,itr.email).subscribe(data => {
	// 				this.progress = index + 1 + '';
	// 				let width = Math.floor((index+1)*100/len);
	// 				this.progressStyle = `width: ${width}%;`;
	// 				if(data && data.message && data.message.includes('')) {
	// 				}
	// 				this.success ++;
	// 			}, error => {
	// 				this.progress = index +'';
	// 				let width = Math.floor(index*100/len);
	// 				this.progressStyle = `width: ${width}%;`;
	// 				this.errors.push(error);
	// 			});
	// 		},index*801);
	// 	});
	// }

	runLoading(index:number) {
		if(this.excelData[index]) {
			let itr = this.excelData[index];
			let len = this.excelData.length;
			this.operService
				.addUserEmail(itr.identifier,itr.email)
				.subscribe(data => {
					this.progress = index + 1 + '';
					let width = Math.floor((index+1)*100/len);
					this.progressStyle = `width: ${width}%;`;
					if(data && data.message && data.message.includes('')) {
					}
					this.success.push({
						identifier: itr.identifier,
						email: itr.email
					});
					this.runLoading(index +1);
				}, error => {
					this.progress = index +'';
					let width = Math.floor(index*100/len);
					this.progressStyle = `width: ${width}%;`;
					this.errors.push({
						identifier: itr.identifier,
						email: itr.email,
						error: error.replace(/<p>/g,'').replace(/<\/p>/g,'')
					});
					this.runLoading(index +1);
				});
		} else {
			this.commonService.displayLog('Success',this.success);
			this.commonService.displayLog('Errors',this.errors);
		}
	}

	reset() {
		this.excelData= [];
		this.progress = '0';
		this.progressStyle = 'width: 0%;';
		this.progressColor = 'bg-primary';
		this.errors = [];
		this.success = [];
		$('#file').val('');
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
			height: '495px',
			width: '900px',
			data: {id}
		});
	}

	goUsersByCompany(id:string,companyName: string) {
		this.router.navigate(['/oper/company',id,'users'], {state:{companyName}});
	}


}

function convertToArray(arr:any) {
	const len = arr.length;
	console.log(arr);
	var returnedArray = [];
	for(let i=1;i<len;i++) {
		if(arr[i].length > 0) {
			returnedArray.push({
				[arr[0][0]]: arr[i][0].toUpperCase(),
				[arr[0][1]]: arr[i][1].toLowerCase()
			})
		}
	}
	return returnedArray;
}
