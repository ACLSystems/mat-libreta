import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

interface Display {
	value: string;
	viewValue: string;
}

@Component({
  selector: 'mat-libreta-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {

	form = new FormGroup({
		field1: new FormControl(''),
		field2: new FormControl(''),
		field3: new FormControl('')
	});

	options: Display[] = [
		{ value: '1', viewValue: 'Opción 1'},
		{ value: '2', viewValue: 'Opción 2'},
		{ value: '3', viewValue: 'Opción 3'}
	]

  constructor() { }

  ngOnInit() {
  }

	get field3() {
		return this.form.get('field3');
	}

	setField3() {
		// console.log(this.form);
	}

}
