import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { Company } from '@wqshared/types/companies.type';
import { Address } from '@wqshared/types/addresses.type';
import { OperService } from '../services/oper.services';

declare const $:any;

@Component({
  selector: 'mat-libreta-createcompany',
  templateUrl: './createcompany.component.html',
  styleUrls: ['./createcompany.component.scss']
})
export class CreatecompanyComponent implements OnInit {

	loading: boolean = false;
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
	company: Company = {
		_id: '',
		type: 'cliente',
		isActive: true,
		name: '',
		identifier: ''
	};
	addresses: Address[] = [];
	phones: string[] = [];

	get name() {
		return this.companyForm.get('name');
	}

	get identifier() {
		return this.companyForm.get('identifier');
	}

	get display() {
		return this.companyForm.get('display');
	}

  constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<CreatecompanyComponent>,
		private operService: OperService
	) {}

	ngOnInit(): void {}

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
			this.operService.createCompany(company).subscribe((data: any) => {
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

	rfcUpper() {
		let identifier = this.companyForm.get('identifier');
		identifier.setValue(identifier.value.toUpperCase());
	}

	receiveAddresses(adds:string) {
		this.addresses = [...JSON.parse(adds)];
		// console.log(this.addresses);
	}

	receivePhones(phs:string) {
		this.phones = [...JSON.parse(phs)];
		// console.log(this.phones);
	}

	closeDialog() {
		this.dialogRef.close();
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
