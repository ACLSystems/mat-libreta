import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';

import { RecoverPassService } from './recoverpass.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
  selector: 'mat-libreta-recoveraccess',
  templateUrl: './recoveraccess.component.html',
  styleUrls: ['./recoveraccess.component.scss'],
	providers: [
		RecoverPassService
	]
})
export class RecoveraccessComponent implements OnInit {

	recoverForm = this.fb.group({
		identifier: ['', [
			Validators.required,
			mustBeValidRFC
		]]
	});

	constructor(
		private recoverPass: RecoverPassService,
		private fb: FormBuilder,
		private router: Router
	) {}


	ngOnInit() {

	}

	get identifier() {
		return this.recoverForm.get('identifier');
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

	regainAccess(api:string) {
		this.validateAllFormFields(this.recoverForm);
		if(!this.recoverForm.valid) {
			return Swal.fire({
				type: 'error',
				text: 'Por favor revisa los campos con error',
				timer: 2000,
				showConfirmButton: false
			});
		}
		Swal.fire('Espera...');
		Swal.showLoading();
		this.recoverPass
			.regainAccess(this.identifier.value,api)
			.subscribe(() => {
				// console.log(data);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'success',
					text: 'En los siguientes minutos revisa tu correo. Este correo tiene instrucciones que debes seguir.'
				});
				this.goHome();
			}, error => {
				console.log(error);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					html: `<p>Hubo un error</p><p>Intenta más tarde</p><p><b>Error</b>: ${error.error.message}</p>`
				});
			});
	}

	goHome(){
		this.router.navigate(['/pages/home']);
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
