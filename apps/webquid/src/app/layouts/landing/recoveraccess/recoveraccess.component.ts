import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { RecoverAccessService } from './recoveraccess.service';

@Component({
  selector: 'mat-libreta-recoveraccess',
  templateUrl: './recoveraccess.component.html',
  styleUrls: ['./recoveraccess.component.scss'],
	providers: [
		RecoverAccessService
	]
})
export class RecoveraccessComponent implements OnInit {

	key: string = '';
	recoverForm = this.fb.group({
		password: ['',[
			Validators.required
		]],
		repPassword: ['',[
			Validators.required
		]],
		identifier: ['',[
			Validators.required,
			mustBeValidRFC
		]]
	},{validator: [mustMatch('password','repPassword')]});

	get password() {
		return this.recoverForm.get('password');
	}

	get repPassword() {
		return this.recoverForm.get('repPassword');
	}

	get identifier() {
		return this.recoverForm.get('identifier');
	}

  constructor(
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private router: Router,
		private recoverAccessService: RecoverAccessService
	) {
		this.activatedRoute.params.subscribe( params => {
			if(params.tokentemp != null) {
				this.key = params.tokentemp;
			}
		});
		// console.log(this.key);
	}

  ngOnInit(): void {
  }

	submit() {
		this.validateAllFormFields(this.recoverForm);
		if(this.recoverForm.valid) {
			Swal.fire('Espera...');
			Swal.showLoading();
			this.recoverAccessService
				.validate(this.identifier.value,this.key,this.password.value)
				.subscribe(data => {
					// console.log(data);
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'success',
						title: 'Contraseña restaurada'
					});
					this.router.navigate(['/pages/login']);
				}, error => {
					console.log(error);
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'error',
						text: `Hubo un error: ${error.error.message}`
					});
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

function mustMatch(controlName: string, matchingControlName: string) {
	return (formGroup: FormGroup) => {
		const control = formGroup.controls[controlName];
		const matchingControl = formGroup.controls[matchingControlName];
		if(matchingControl.errors && !matchingControl.errors.mustMatch) {
			return;
		}
		if(control.value !== matchingControl.value) {
			matchingControl.setErrors({ mustMatch: true});
		} else {
			matchingControl.setErrors(null);
		}
	}
}
