import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';

import { OperService } from '../services/oper.services';
import { CommonService } from '@wqshared/services/common.service';
import { NotElemService } from '@mat-libreta/shared';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
  selector: 'mat-libreta-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent implements OnInit {

	userForm = this.fb.group({
		identifier: ['',[Validators.required, mustBeValidRFC]],
		email: ['',[Validators.required, mustBeValidEmail]],
		name: ['',[Validators.required]],
		fatherName: ['', [Validators.required]],
		motherName: ['', [Validators.required]],
		company: ['',[Validators.required]]
	});
	companySearchResults: any[] = [];
	selectedCompany: number = 0;
	password: string = '';
	matcher = new MyErrorStateMatcher();

  constructor(
		private fb: FormBuilder,
		private operService: OperService,
		private commonService: CommonService,
		private notElemService: NotElemService,
		public dialogRef: MatDialogRef<CreateuserComponent>
	) { }

  ngOnInit(): void {
  }

	get identifier() {
		return this.userForm.get('identifier');
	}
	get email() {
		return this.userForm.get('email');
	}
	get name() {
		return this.userForm.get('name');
	}
	get fatherName() {
		return this.userForm.get('fatherName');
	}
	get motherName() {
		return this.userForm.get('motherName');
	}
	get company() {
		return this.userForm.get('company');
	}

	searchCompany() {
		let companyValue = this.company.value
		console.log(companyValue);
		if(companyValue.length > 2) {
			this.operService.searchCompanies(companyValue).subscribe(data => {
				this.commonService.displayLog('Data',data);
				if(data && data.message) {
					Swal.fire({
						type: 'warning',
						text: data.message
					});
					this.companySearchResults = [];
					return;
				} else {
					this.companySearchResults = [...data];
				}
				if(this.companySearchResults.length === 1) {
					this.company.setValue(this.companySearchResults[0].name);
					this.selectedCompany = 0;
					return;
				}
				if(this.companySearchResults.length > 1) {
					let companies = this.companySearchResults.map(comp => {
						return comp.name;
					})
					Swal.fire({
						type: 'question',
						text: 'Encontramos más de un resultado. Por favor selecciona',
						input: 'select',
						showCancelButton: true,
						showConfirmButton: true,
						confirmButtonColor: 'blue',
						confirmButtonText: 'Elegir',
						inputOptions: Object.assign(companies)
					}).then(result => {
						this.selectedCompany = +result.value;
						this.company.setValue(this.companySearchResults[this.selectedCompany].name);
					});
				}
			}, error=>{
				console.log(error);
				Swal.fire({
					type: 'error',
					text: 'Ocurrió un error'
				});
			});
		}
	}

	close() {
		this.dialogRef.close();
	}

	reset() {
		this.userForm.reset();
		this.selectedCompany = 0;
		this.companySearchResults = [];
		this.password = null;
	}

	save(){
		this.validateAllFormFields(this.userForm);
		if(this.userForm.valid)  {
			this.identifier.setValue(this.identifier.value.toUpperCase());
			this.email.setValue(this.email.value.toLowerCase());
			this.name.setValue(properCase(this.name.value));
			this.fatherName.setValue(properCase(this.fatherName.value));
			this.motherName.setValue(properCase(this.motherName.value));
			const user = {
				identifier: this.identifier.value,
				person: {
					name: this.name.value,
					fatherName: this.fatherName.value,
					motherName: this.motherName.value,
					email: this.email.value
				},
				companies: [{
					isActive: true,
					company: this.companySearchResults[this.selectedCompany]._id
				}]
			};
			this.commonService.displayLog('user',user);
			Swal.fire('Espera...');
			Swal.showLoading();
			this.operService.createUser(user).subscribe(data => {
				console.log(data);
				Swal.hideLoading();
				Swal.close();
				if(data.message) {
					Swal.fire({
						type: 'warning',
						text: data.message
					})
				} else {
					this.password = data.initialPassword;
					this.notElemService.showNotification(
						'bottom',
						'left',
						'success',
						'Usuario creado correctamente'
					);
				}
			}, error => {
				console.log(error);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					html: error
				});
			});
		} else {
			Swal.fire({
				type: 'warning',
				text: 'Revisa que no haya campos con errores'
			});
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if(control instanceof FormControl) {
				control.markAsDirty({ onlySelf: true});
			} else if(control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}


}

function mustBeValidRFC(field: FormControl) {
	let RFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
	// console.log(field);
	let value = field.value;
	if(value === '' || !value) {
		return null;
	}
	value = value.toUpperCase();
	return RFC.test(value) ? null : {
		validRFC: true
	}
}

function mustBeValidEmail(field: FormControl) {
	let emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	let value = field.value;
	if(value === '' || !value) {
		return null;
	}
	// console.log(value);
	value = value.toUpperCase();
	return emailRegex.test(value) ? null : {
		validateEmail: {
			valid: false
		}
	}
}

function properCase(phrase:string) {
	const words = phrase.split(' ');
	const newWords = words.map(word => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return newWords.join(' ');
}
