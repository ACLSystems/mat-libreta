import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Company } from '@wqshared/types/companies.type';
import { Address } from '@wqshared/types/addresses.type';

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
		private fb: FormBuilder
	) {}

	ngOnInit(): void {}

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
		console.log(this.addresses);
	}

	receivePhones(phs:string) {
		this.phones = [...JSON.parse(phs)];
		console.log(this.phones);
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
