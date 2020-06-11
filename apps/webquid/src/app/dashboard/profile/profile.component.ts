import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';

import { UserService } from '@wqshared/services/user.service';
import { Identity } from '@wqshared/types/user.type';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
  selector: 'mat-libreta-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	loading: boolean = false;
	identity: Identity
	matcher = new MyErrorStateMatcher();
	passForm = this.fb.group({
		oldPass: ['', [
			Validators.required
		]],
		pass1: ['',[
			Validators.required
		]],
		pass2: ['',[
			Validators.required
		]]
	},{
		validator: [
			this.mustMatch('pass1', 'pass2')
		]
	});

	get pass1() {
		return this.passForm.get('pass1');
	}

	get pass2() {
		return this.passForm.get('pass2');
	}

	get oldPass() {
		return this.passForm.get('oldPass');
	}

  constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router
	) {
		this.identity = this.userService.getidentity();
		// console.log(this.identity);
	}

  ngOnInit(): void {
  }

	changePass() {
		this.validateAllFormFields(this.passForm);
		if(!this.passForm.valid) {
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los errores',
				timer: 2000,
				showConfirmButton: false
			});
			return;
		}
		Swal.fire('Espera...');
		Swal.showLoading();
		this.userService.newPass(this.oldPass.value,this.pass1.value)
			.subscribe(data => {
				Swal.hideLoading();
				Swal.close();
				if(data && data.message && data.message.includes('Contraseña modificada')) {
					Swal.fire({
						type: 'success',
						text: data.message
					});
					this.router.navigate(['/pages/logout']);
				} else {
					Swal.fire({
						type: 'warning',
						text: data.message
					});
				}

			}, error => {
				console.log(error);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					text: `Hubo un error al intentar modificar la constraseña: ${error.error.message}`
				});
			});
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

	mustMatch(controlName: string, matchingControlName: string) {
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

}
