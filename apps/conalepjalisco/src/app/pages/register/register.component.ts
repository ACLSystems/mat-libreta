import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { PublicService } from '@mat-libreta/shared';

import { environment } from '@cjaenv/environment';

@Component({
  selector: 'mat-libreta-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

	registerForm = new FormGroup({});
	agree: boolean = false;
	notAgree: boolean = false;

  constructor(
		private fb: FormBuilder,
		private publicService: PublicService,
		private router: Router
	) { }

  ngOnInit() {
		this.registerForm = this.fb.group({
			name: 			['', [Validators.required]],
			fatherName: ['', [Validators.required]],
			motherName: ['', [Validators.required]],
			email: 			['', [
				Validators.required,
				Validators.email,
				Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]
			],
			remail: 		['', [
				Validators.required,
				Validators.email,
				Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
			]],
			password: 	['', [
				Validators.required,
				Validators.minLength(8)]
			],
			rpassword: 	['', [
				Validators.required,
				Validators.minLength(8)]
			],
			agree: [true]
		},{validator: [this.mustMatch('password', 'rpassword'), this.mustMatch('email', 'remail')]});
		var setAgree = this.registerForm.get('agree');
		setAgree.setValue(false);
		// const card = document.getElementsByClassName('card')[0];
		// setTimeout(function() {
		// 		// after 1000 ms we add the class animated to the login/register card
		// 		card.classList.remove('card-hidden');
		// }, 800);
  }

	get name() {
		return this.registerForm.get('name');
	}

	get fatherName() {
		return this.registerForm.get('fatherName');
	}

	get motherName() {
		return this.registerForm.get('motherName');
	}

	get email() {
		return this.registerForm.get('email');
	}

	get remail() {
		return this.registerForm.get('remail');
	}

	get password() {
		return this.registerForm.get('password');
	}

	get rpassword() {
		return this.registerForm.get('rpassword');
	}

	submit() {
		if(this.registerForm.valid) {
			this.agree = this.registerForm.get('agree').value;
			if(this.agree) {
				const register = {
					name: this.registerForm.get('email').value.toLowerCase(),
					password: this.registerForm.get('password').value,
					person: {
						name: this.registerForm.get('name').value,
						fatherName: this.registerForm.get('fatherName').value,
						motherName: this.registerForm.get('motherName').value,
						email: this.registerForm.get('email').value.toLowerCase()
					},
					org: environment.instanceName,
					orgUnit: environment.orgUnitName
				};
				// console.log(register);
				Swal.fire('Solicitando registro. Espera...');
				Swal.showLoading();
				// console.log(register);
				this.publicService.register(register).subscribe(data => {
					if(data && data.uri) {
						delete data.uri;
					}
					// console.log(data);
					if(data && data.userid) {
						Swal.hideLoading();
						Swal.close()
						Swal.fire({
							type: 'info',
							html: `En los siguientes minutos te llegará un correo a la cuenta <br><b>${this.email.value}</b><br>Revisa ese correo y sigue las instrucciones.<br>Busca en la carpeta de "No deseados" si este correo no llegara en los próximos minutos`
						});
						this.registerForm.reset();
						this.router.navigate(['/pages/home']);
					}

				}, error => {
					console.log(error);
					Swal.hideLoading();
					Swal.close();
					if(error && error.error && error.error.message && error.error.message === 'You have already been registered previously') {
						Swal.fire({
							type: 'warning',
							html: `Ya existe un registro con la cuenta <b>${this.registerForm.get('email').value.toLowerCase()}</b>`
						});
						this.registerForm.reset();
						this.router.navigate(['/pages/login']);
					} else {
						Swal.fire({
							type: 'error',
							text: 'Ocurrió un error en el registro. Espera unos minutos y vuelve a intentar'
						});
					}
				});
			} else {
				this.notAgree = true;
				Swal.fire({
					type: 'error',
					text: 'Debes estar de acuerdo con los términos y condiciones para poder registrarte'
				});
			}
		} else {
			this.validateAllFormFields(this.registerForm);
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
