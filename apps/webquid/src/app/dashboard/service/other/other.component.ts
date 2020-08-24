import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { Service } from '@wqshared/types/services.type';
import { Identity } from '@wqshared/types/user.type';
import { UserService } from '@wqshared/services/user.service';

const serviceGeneric = '50';

@Component({
  selector: 'webquid-service-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent implements OnInit {

	email: String = '';
	identity: Identity;
	serviceForm = this.fb.group({
		subject: ['', [Validators.required]],
		description: ['', [Validators.required]]
	});

	get subject() {
		return this.serviceForm.get('subject');
	}

	get description() {
		return this.serviceForm.get('description');
	}

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router
	) {
		this.identity = this.userService.getidentity();
		this.email = (this.identity && this.identity.person && this.identity.person.email) ? this.identity.person.email : '';
	}

	ngOnInit(): void {}

	sendRequest() {
		this.validateAllFormFields(this.serviceForm);
		if(!this.serviceForm.valid) {
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los campos con error',
				timer: 2000,
				showConfirmButton: false
			});
			console.log(this.serviceForm);
			return;
		}

		var submitForm: any = {
			quantity: 1,
			email: this.email,
			custom_fields: {
				solicitud: this.subject.value,
				detalle: this.description.value
			}
		}
		// console.log(submitForm);
		Swal.fire('Espera...');
		Swal.showLoading();
		const url = `/api/v2/service_catalog/items/${serviceGeneric}/place_request`;
		this.userService
			.createServiceRequest('post',url,submitForm)
			.subscribe(data => {
				Swal.close();
				Swal.hideLoading();
				if(data && data.service_request) {
					Swal.fire({
						type: 'success',
						html: `Se ha generado una solicitud a tu nombre con el ticket número ${data.service_request.id}`
					});
				} else {
					Swal.fire({
						type: 'warning',
						html: 'El sistema no nos devolvió el número de ticket'
					});
				}
				this.serviceForm.reset();
				this.router.navigate(['/services']);
			}, error => {
				Swal.close();
				Swal.hideLoading();
				Swal.fire({
					type: 'error',
					text: 'Ocurrió un error en el envio de la Solicitud. Intenta más tarde y si el problema persiste notifica a la mesa de soporte para resolverlo'
				});
				console.log(error);
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

}
