import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Address } from '@wqshared/types/addresses.type';

@Component({
  selector: 'webquid-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

	addressForm = this.fb.group({
		line1: [''],
		line2: [''],
		postalCode: [''],
		locality: [''],
		city: [''],
		state: [''],
		country: ['México']
	})
	addresses: Address[] = [];
	@Output() addressesEvent = new EventEmitter<string>();

	get line1() {
		return this.addressForm.get('line1');
	}
	get line2() {
		return this.addressForm.get('line2');
	}
	get postalCode() {
		return this.addressForm.get('postalCode');
	}
	get locality() {
		return this.addressForm.get('locality');
	}
	get city() {
		return this.addressForm.get('city');
	}
	get state() {
		return this.addressForm.get('state');
	}
	get country() {
		return this.addressForm.get('country');
	}

  constructor(
		private fb: FormBuilder
	) { }

  ngOnInit(): void {
  }

	addAddress() {
		let address: Address = {
			line1: this.addressForm.get('line1').value,
			line2: this.addressForm.get('line2').value,
			postalCode: this.addressForm.get('postalCode').value,
			locality: this.addressForm.get('locality').value,
			city: this.addressForm.get('city').value,
			state: this.addressForm.get('state').value,
			country: this.addressForm.get('country').value,
		}
		this.addresses.push(address);
		this.addressForm.reset();
		this.addressForm.get('country').setValue('México');
		// console.log(this.addresses);
		console.log('En child. Enviando addresses');
		this.addressesEvent.emit(JSON.stringify(this.addresses));
	}

	removeAddress(index:number) {
		console.log(index);
		let addresses = [...this.addresses];
		addresses = addresses.slice(0,index).concat(addresses.slice(index + 1, addresses.length));
		this.addresses = [...addresses];
		this.addressesEvent.emit(JSON.stringify(this.addresses));
	}

}
