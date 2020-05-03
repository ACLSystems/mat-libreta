import { Component, OnInit, Input, Output, Optional, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'webquid-phones',
  templateUrl: './phones.component.html',
  styleUrls: ['./phones.component.scss']
})
export class PhonesComponent implements OnInit {

	phoneForm = this.fb.group({
		phone: ['']
	})
	@Input() phones: string[] = [];
	@Output() phonesEvent = new EventEmitter<string>();

	get phone() {
		return this.phoneForm.get('phone');
	}

  constructor(
		private fb: FormBuilder
	) {
	}

  ngOnInit(): void {
  }

	addPhone() {
		let phone = this.phoneForm.get('phone').value;
		if(phone === '') {
			return;
		}
		let findPhone = this.phones.find(ph => ph == phone);
		if(!findPhone) {
			this.phones.push(phone);
			this.phoneForm.get('phone').setValue('');
			this.phonesEvent.emit(JSON.stringify(this.phones));
		}
	}

	removePhone(phone:string) {
		this.phones = this.phones.filter(ph => ph !== phone);
		this.phonesEvent.emit(JSON.stringify(this.phones));
	}

}
