import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';


import { OperService } from '../services/oper.services';
import { Company } from '@wqshared/types/companies.type';
import { Address } from '@wqshared/types/addresses.type';

@Component({
  selector: 'mat-libreta-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

	companyid: string;
	loading: boolean = false;
	company: Company;
	companyMessage: string = '';
	companyForm = this.fb.group({
		identifier: ['', [
			Validators.required,
			mustBeValidRFC
		]],
		display: ['',[
			Validators.required
		]],
		name: ['',[
			Validators.required
		]]
	});
	addresses: Address[] = [];
	phones: String[] = [];
	companySend: any;
	phonesDirty: boolean = false;
	addressesDirty: boolean = false;


  constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) public id: any,
		private operService: OperService,
		public dialogRef: MatDialogRef<CompanyComponent>,
		private fb: FormBuilder
	) {
		if(id && id.id) {
			this.companyid = id.id;
		}
	}

	get name() {
		return this.companyForm.get('name');
	}

	get identifier() {
		return this.companyForm.get('identifier');
	}

	get display() {
		return this.companyForm.get('display');
	}

  ngOnInit(): void {
		this.loading = true;
		if(this.companyid) {
			this.operService.getCompany(this.companyid).subscribe(data => {
				if(data && data.message && data.message.includes('No hay empresa con el id especificado')) {
					this.companyMessage = data.message;
				} else {
					this.company = data;
					// console.log(this.company);
					this.populateForm();
				}
				this.loading = false;
			}, error => {
				console.log(error);
				this.companyMessage = error.message;
			});
		}
  }

	rfcUpper() {
		let identifier = this.companyForm.get('identifier');
		identifier.setValue(identifier.value.toUpperCase());
	}

	populateForm() {
		this.companyForm.get('identifier').setValue(this.company.identifier || '');
		this.companyForm.get('name').setValue(this.company.name || '');
		this.companyForm.get('display').setValue(this.company.display || '');
		this.addresses = [...this.company.addresses];
		this.phones = [...this.company.phone];
	}

	receiveAddresses(adds:string) {
		this.addresses = [...JSON.parse(adds)];
		// console.log(this.addresses);
		this.addressesDirty = true;
	}

	receivePhones(phs:string) {
		this.phones = [...JSON.parse(phs)];
		// console.log(this.phones);
		this.phonesDirty = true;
	}

	submit() {
		this.validateAllFormFields(this.companyForm);
		// console.log(this.companyForm);
		if(this.companyForm.valid) {
			let company = {
				id: this.company._id,
				phone: (this.phonesDirty ) ? [...this.phones] : null,
				name: this.companyForm.get('name').touched ? this.name.value : null,
				display: this.companyForm.get('display').touched ? this.display.value : null,
				identifier: this.companyForm.get('identifier').touched ? this.identifier.value : null,
				addresses: (this.addressesDirty) ? [...this.addresses] : null
			}
			let keys = Object.keys(company);
			keys.forEach(key => {
				if(company[key] === null) {
					delete company[key]
				}
			});

			// console.log(company);
			Swal.fire('Espera...');
			Swal.showLoading();
			// console.log(company);
			this.operService.updateCompany(company).subscribe((data: any) => {
				console.group('Data');
				console.log(data);
				console.groupEnd();
				if(data && data._id === this.company._id) {
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'success',
						text: 'Empresa modificada'
					});
					this.closeDialog();
				}
			}, error => {
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					text: `Hubo un error en la transacción: ${error.message}`
				});
				console.log(company);
				console.log(error)
			});
		} else {
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los errores',
				timer: 2000,
				showConfirmButton: false
			});
		}
	}

	closeDialog() {
		this.dialogRef.close();
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
	let value = field.value;
	if(value === '') {
		return null;
	}
	value = value.toUpperCase();
	return RFC.test(value) ? null : {
		validateEmail: {
			valid: false
		}
	}
}
