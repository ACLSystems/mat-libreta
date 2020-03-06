import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

interface Display {
	value: string;
	viewValue: string;
}

@Component({
  selector: 'mat-libreta-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

	form = new FormGroup({
		subject: new FormControl(''),
		description: new FormControl(''),
		type: new FormControl('')
	});

	options: Display[] = [
		{ value: 'req', viewValue: 'Solicitud'},
		{ value: 'prob', viewValue: 'Problema'},
		{ value: 'comp', viewValue: 'Queja'}
	]

  constructor() { }

  ngOnInit() {
  }

}
