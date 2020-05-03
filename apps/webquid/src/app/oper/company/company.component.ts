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
	phones: string[] = [];


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

	receiveAddresses(adds:string) {
		this.addresses = [...JSON.parse(adds)];
		console.log(this.addresses);
	}

	receivePhones(phs:string) {
		this.phones = [...JSON.parse(phs)];
		console.log(this.phones);
	}

	submit() {
		this.validateAllFormFields(this.companyForm);
		if(this.companyForm.valid) {
			let company: Company = {
				type: 'cliente',
				phone: (this.phones.length > 0) ? [...this.phones] : [],
				isActive: true,
				name: this.name.value,
				display: this.display.value,
				identifier: this.identifier.value,
				addresses: (this.addresses.length > 0) ? [...this.addresses] : []
			}

			Swal.fire('Espera...');
			Swal.showLoading();
			// console.log(company);
			this.operService.updateCompany(company).subscribe((data: any) => {
				Swal.hideLoading();
				Swal.close();
				if(data && data.identifier === company.identifier) {
					Swal.fire({
						type: 'success',
						text: 'Empresa creada'
					});
					this.dialogRef.close();
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
