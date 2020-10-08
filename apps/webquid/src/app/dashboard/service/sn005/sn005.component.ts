import {
	Component,
	OnInit,
	LOCALE_ID,
	Input
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	FormControl,
	Validators
} from '@angular/forms';
import {
	Router
} from '@angular/router';
import {
	MAT_DATE_LOCALE,
	DateAdapter
} from '@angular/material/core';
import localeMX from '@angular/common/locales/es-MX';
import Swal from 'sweetalert2';

import { UserService } from '@wqshared/services/user.service';
import { Identity } from '@wqshared/types/user.type';

import { CommonService } from '@mat-libreta/shared';

registerLocaleData(localeMX);

@Component({
  selector: 'webquid-sn005',
  templateUrl: './sn005.component.html',
  styleUrls: ['./sn005.component.scss'],
	providers: [
		{ provide: LOCALE_ID, useValue: 'es-MX'},
		{ provide: MAT_DATE_LOCALE, useValue: 'es-MX'}
	]
})
export class Sn005Component implements OnInit {

	@Input() serviceid: string;
	identity: Identity;
	vacationForm = this.fb.group({
		beginDate: ['', Validators.required],
		endDate: ['', Validators.required],
		description: ['', Validators.required]
	}, {validator: [this.eGTb()]});
	daysConsumed: number = 0;
	daysGranted: number = 0;
	daysToTake: number = 0;
	thisYear: number;
	canSubmit: boolean = false;

	constructor(
		private fb: FormBuilder,
		private userservice: UserService,
		private dateAdapter: DateAdapter<any>,
		private userService: UserService,
		private commonService: CommonService,
		private router: Router
	) {
		this.thisYear = new Date().getFullYear();
		this.identity = this.userservice.getidentity();
		console.log(this.identity);
		if(this.identity.companies) {
			this.identity.companies.forEach(company => {
				if(company.beginDate) this.canSubmit = true;
			});
		}
		if(this.identity.companies.length > 0) {
			for(var i=0;i<this.identity.companies.length;i++) {
				const company = this.identity.companies[i];
				if(company.vacationHistory && company.vacationHistory.length > 0) {
					const vacs = company.vacationHistory.reduce((acc,value) => {
						const keys = Object.keys(value);
						if(value.approved || !keys.includes('approved')) {
							return acc + value.totalDays;
						}
					},0);
					this.daysConsumed += vacs;
					// console.log(vacs);
				}
				this.daysGranted = company.vacations.days - this.daysConsumed;
			}
		}
		this.spanishLocale();
	}

	ngOnInit() {
	}

	spanishLocale() {
		this.dateAdapter.setLocale('es-MX');
	}

	get beginDate() {
		return this.vacationForm.get('beginDate');
	}

	get endDate() {
		return this.vacationForm.get('endDate');
	}

	get description() {
		return this.vacationForm.get('description');
	}

	datesInput() {
		if(this.beginDate.value && this.endDate.value) {
			const oneDay = 24 * 60 * 60 * 1000;
			// const tzbd = this.beginDate.value.getTimezoneOffset();
			// const tzed = this.endDate.value.getTimezoneOffset();
			// const diff = Math.abs(Math.round((tzbd - tzed) / 60));
			// console.log(diff);
			this.beginDate.setValue(new Date(
				this.beginDate.value.getFullYear(),
				this.beginDate.value.getMonth(),
				this.beginDate.value.getDate(),
				2,0,0
			));
			this.endDate.setValue(new Date(
				this.endDate.value.getFullYear(),
				this.endDate.value.getMonth(),
				this.endDate.value.getDate(),
				20,59,59
			));
			this.daysToTake = Math.ceil(((this.endDate.value.getTime() - this.beginDate.value.getTime()) / oneDay));
			// console.log(this.beginDate.value);
			// console.log(this.endDate.value);
			// console.log(tzbd);
			// console.log(tzed);
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if(control instanceof FormControl) {
				control.markAsDirty({ onlySelf: true});
				control.markAsTouched({ onlySelf: true});
			} else if(control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	eGTb() {
		return(formGroup: FormGroup)  => {
			const bDate = formGroup.controls['beginDate'];
			const eDate = formGroup.controls['endDate'];
			if(eDate.errors && !eDate.errors.eGTb) {
				return;
			}
			if(bDate.value > eDate.value) {
				eDate.setErrors({ eGTb: true });
				bDate.setErrors({ eGTb: true });
				Swal.fire({
					type: 'error',
					text: 'Fecha de último día de vacaciones debe ser mayor a la fecha de inicio'
				})
			} else {
				eDate.setErrors(null);
				bDate.setErrors(null);
			}
		}
	}

	submit(company: string) {
		this.validateAllFormFields(this.vacationForm);
		if(!this.vacationForm.valid) {
			Swal.fire({
				type: 'warning',
				text: 'Revisa los campos de tu solicitud'
			});
			return;
		}
		Swal.fire('Espera...');
		Swal.showLoading();
		const vacations = {
			identifier: this.identity.identifier,
			company,
			api: `/api/v2/service_catalog/items/${this.serviceid}/place_request`,
			vacation: {
				beginDate: this.beginDate.value,
				endDate: this.endDate.value,
				justify: this.description.value
			}
		}
		this.commonService.displayLog('vacations',vacations);
		this.userService.createVacations(vacations)
			.subscribe(data => {
				this.commonService.displayLog('Respuesta',data);
				var freshid;
				if(data.freshid) freshid = data.freshid;
				this.userService.getMyDetails().subscribe(data => {
					if(data && data._id) {
						this.identity.companies = [...data.companies];
					}
					Swal.hideLoading();
					Swal.close();
					const text = freshid ? `Se ha enviado tu solicitud con número: ${freshid}`: 'Se ha enviado tu solicitud'
					Swal.fire({
						type: 'success',
						text
					});
					this.router.navigate(['/services']);
				}, error => {
					console.log(error);
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'error',
						html: `Hubo un error al recuperar información: ${error}`
					});
				})
			}, error => {
				console.log(error);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					html: `Hubo un error al tratar de enviar la solicitud: ${error}`
				});
			});
	}

}
