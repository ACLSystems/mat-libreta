import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';

import { CVService } from '../services/cv.service';

registerLocaleData(localeEs,'es-MX');

import {
	Display,
	DisplayGroups,
	DisplayWithCategory
} from '@wqshared/types/display.type';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
  selector: 'mat-libreta-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit, AfterViewInit {

	loading: boolean = false;
	token: string|null = null;
	cv: any;

	jobForm = this.fb.group({
		identifier: ['', [
			Validators.required,
			mustBeValidRFC
		]],
		name: ['',[
			Validators.required
		]],
		fatherName: ['',[
			Validators.required
		]],
		motherName: ['',[
			Validators.required
		]],
		email: ['',[
			Validators.required,
			Validators.email,
			Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
		]],
		gender:  ['',[
			Validators.required
		]],
		jobName: ['',[
			Validators.required
		]],
		jobPlace: ['',[
			Validators.required
		]],
		childrenNumber: [0,[
			Validators.required
		]],
		civil: ['',[
			Validators.required
		]],
		birthPlace: ['',[
			Validators.required
		]],
		phone: ['',[
			Validators.required
		]],
		cellPhone: ['',[
			Validators.required
		]],
		messagePhone: ['',[
			Validators.required
		]],
		adLine1: ['',[
			Validators.required
		]],
		adLine2: ['',[
			Validators.required
		]],
		adPostalCode: ['',[
			Validators.required
		]],
		adLocality: ['',[
			Validators.required
		]],
		adCity: ['',[
			Validators.required
		]],
		adState: ['',[
			Validators.required
		]],
		adCountry: ['',[
			Validators.required
		]],
		hHobbies: ['',[
			Validators.required
		]],
		hAlcohol: ['',[
			Validators.required
		]],
		hAlcoholFrec: ['',[
			Validators.required
		]],
		hTobacco: ['',[
			Validators.required
		]],
		hTobaccoFrec: ['',[
			Validators.required
		]],
		hMainStrength: ['',[
			Validators.required
		]],
		hMainOppAreas: ['',[
			Validators.required
		]],
		qDistanceToHome: [0,[
			Validators.required,
			Validators.min(0)
		]],
		qDistanceHomeUnits: ['',[
			Validators.required
		]],
		qDailyTransportRate: [0,[
			Validators.required,
			Validators.min(0)
		]],
		qGasWeeklyRate: [0,[
			Validators.required,
			Validators.min(0)
		]],
		qOwnAutomobile: [false],
		qOwnHouse: [false],
		qRent: [false],
		qFamilyHouse: [false],
		qMortage: [false],
		qRentCost: ['',[
			Validators.required
		]],
		qInfonavitRetention: ['',[
			Validators.required
		]],
		qPlaceShift: [false],
		qWhyPlaceShift: ['',[
			Validators.required
		]],
		qMontlyIncome: [0,[
			Validators.required,
			Validators.min(0)
		]],
		qMontlyExpenses: [0,[
			Validators.required,
			Validators.min(0)
		]],
	});

	childForm = this.fb.group({
		childname: ['',[
			Validators.required
		]],
		childBirthDate: ['',[
			Validators.required
		]],
		childScholarShip: ['',[
			Validators.required
		]],
		childOccupation: ['',[
			Validators.required
		]]
	});

	academicForm = this.fb.group({
		aiStudies: ['',[
			Validators.required
		]],
		aiDiplomas: ['',[
			Validators.required
		]],
		aiCertificates: ['',[
			Validators.required
		]],
		aiInstitute: ['',[
			Validators.required
		]],
		aiBeginDate: ['',[
			Validators.required
		]],
		aiEndDate: ['',[
			Validators.required
		]]
	});

	workInfoForm = this.fb.group({
		wiCompanyName: ['',[
			Validators.required
		]],
		wiBeginDate: ['',[
			Validators.required
		]],
		wiEndDate: ['',[
			Validators.required
		]],
		wiInitialJob: ['',[
			Validators.required
		]],
		wiFinalJob: ['',[
			Validators.required
		]],
		wiSalary: [0,[
			Validators.required
		]],
		wiReasonToLeave: ['',[
			Validators.required
		]],
		wiBossName: ['',[
			Validators.required
		]],
		wiCompanyPhone: ['',[
			Validators.required
		]],
		wiReferencePhone: ['',[
			Validators.required
		]]
	});

	jobScheduleForm = this.fb.group({
		jobWeekSchedule: ['',[
			Validators.required
		]],
		jobDailySchedule: ['',[
			Validators.required
		]],
	});

	familyForm = this.fb.group({
		famName: ['',[
			Validators.required
		]],
		famBirthDate: ['',[
			Validators.required
		]],
		famRelationShip: ['',[
			Validators.required
		]],
		famOccupation: ['',[
			Validators.required
		]]
	});

	referenceForm = this.fb.group({
		refname: ['',[
			Validators.required
		]],
		refphone: ['',[
			Validators.required
		]]
	});

	edoCivil: Display[] = [
		{
			value: 'Casado',
			viewValue: 'Casado'
		},
		{
			value: 'Soltero',
			viewValue: 'Soltero'
		}
	];

	semana: Display[] = [
		{
			value: 'Lunes',
			viewValue: 'Lunes'
		},
		{
			value: 'Martes',
			viewValue: 'Martes'
		},
		{
			value: 'Miércoles',
			viewValue: 'Miércoles'
		},
		{
			value: 'Jueves',
			viewValue: 'Jueves'
		},
		{
			value: 'Viernes',
			viewValue: 'Viernes'
		},
		{
			value: 'Sábado',
			viewValue: 'Sábado'
		},
		{
			value: 'Domingo',
			viewValue: 'Domingo'
		}
	];

	drougfrec: Display[] = [
		{
			value: 'Diario',
			viewValue: 'Diario'
		},
		{
			value: 'Una vez a la semana',
			viewValue: 'Una vez a la semana'
		},
		{
			value: 'Una vez al mes',
			viewValue: 'Una vez al mes'
		}
	];

	units: Display[] = [
		{
			value: 'minutos',
			viewValue: 'minutos'
		},
		{
			value: 'horas',
			viewValue: 'horas'
		}
	];

	// genero: Display[] = [
	// 	{
	// 		value: 'Hombre',
	// 		viewValue: 'Hombre'
	// 	},
	// 	{
	// 		value: 'Mujer',
	// 		viewValue: 'Mujer'
	// 	}
	// ];

	get identifier() {
		return this.jobForm.get('identifier');
	}
	get name() {
		return this.jobForm.get('name');
	}
	get fatherName() {
		return this.jobForm.get('fatherName');
	}
	get motherName() {
		return this.jobForm.get('motherName');
	}
	get email() {
		return this.jobForm.get('email');
	}
	get jobName() {
		return this.jobForm.get('jobName');
	}
	get jobPlace() {
		return this.jobForm.get('jobPlace');
	}
	get childrenNumber() {
		return this.jobForm.get('childrenNumber');
	}
	get civil() {
		return this.jobForm.get('civil');
	}
	get birthPlace() {
		return this.jobForm.get('birthPlace');
	}
	get phone() {
		return this.jobForm.get('phone');
	}
	get cellPhone() {
		return this.jobForm.get('cellPhone');
	}
	get messagePhone() {
		return this.jobForm.get('messagePhone');
	}
	get adLine1() {
		return this.jobForm.get('adLine1');
	}
	get adLine2() {
		return this.jobForm.get('adLine2');
	}
	get adPostalCode() {
		return this.jobForm.get('adPostalCode');
	}
	get adLocality() {
		return this.jobForm.get('adLocality');
	}
	get adCity() {
		return this.jobForm.get('adCity');
	}
	get adState() {
		return this.jobForm.get('adState');
	}
	get adCountry() {
		return this.jobForm.get('adCountry');
	}
	get wiCompanyName() {
		return this.workInfoForm.get('wiCompanyName');
	}
	get wiBeginDate() {
		return this.workInfoForm.get('wiBeginDate');
	}
	get wiEndDate() {
		return this.workInfoForm.get('wiEndDate');
	}
	get wiInitialJob() {
		return this.workInfoForm.get('wiInitialJob');
	}
	get wiFinalJob() {
		return this.workInfoForm.get('wiFinalJob');
	}
	get wiSalary() {
		return this.workInfoForm.get('wiSalary');
	}
	get wiReasonToLeave() {
		return this.workInfoForm.get('wiReasonToLeave');
	}
	get wiBossName() {
		return this.workInfoForm.get('wiBossName');
	}
	get wiCompanyPhone() {
		return this.workInfoForm.get('wiCompanyPhone');
	}
	get wiReferencePhone() {
		return this.workInfoForm.get('wiReferencePhone');
	}
	get aiStudies() {
		return this.academicForm.get('aiStudies');
	}
	get aiDiplomas() {
		return this.academicForm.get('aiDiplomas');
	}
	get aiCertificates() {
		return this.academicForm.get('aiCertificates');
	}
	get aiInstitute() {
		return this.academicForm.get('aiInstitute');
	}
	get aiBeginDate() {
		return this.academicForm.get('aiBeginDate');
	}
	get aiEndDate() {
		return this.academicForm.get('aiEndDate');
	}
	get hHobbies() {
		return this.jobForm.get('hHobbies');
	}
	get hAlcohol() {
		return this.jobForm.get('hAlcohol');
	}
	get hAlcoholFrec() {
		return this.jobForm.get('hAlcoholFrec');
	}
	get hTobacco() {
		return this.jobForm.get('hTobacco');
	}
	get hTobaccoFrec() {
		return this.jobForm.get('hTobaccoFrec');
	}
	get hMainStrength() {
		return this.jobForm.get('hMainStrength');
	}
	get hMainOppAreas() {
		return this.jobForm.get('hMainOppAreas');
	}
	get qDistanceToHome() {
		return this.jobForm.get('qDistanceToHome');
	}
	get qDistanceHomeUnits() {
		return this.jobForm.get('qDistanceHomeUnits');
	}
	get qDailyTransportRate() {
		return this.jobForm.get('qDailyTransportRate');
	}
	get qGasWeeklyRate() {
		return this.jobForm.get('qGasWeeklyRate');
	}
	get qOwnAutomobile() {
		return this.jobForm.get('qOwnAutomobile');
	}
	get qOwnHouse() {
		return this.jobForm.get('qOwnHouse');
	}
	get qRent() {
		return this.jobForm.get('qRent');
	}
	get qFamilyHouse() {
		return this.jobForm.get('qFamilyHouse');
	}
	get qMortage() {
		return this.jobForm.get('qMortage');
	}
	get qRentCost() {
		return this.jobForm.get('qRentCost');
	}
	get qInfonavitRetention() {
		return this.jobForm.get('qInfonavitRetention');
	}
	get qPlaceShift() {
		return this.jobForm.get('qPlaceShift');
	}
	get qWhyPlaceShift() {
		return this.jobForm.get('qWhyPlaceShift');
	}
	get qMontlyIncome() {
		return this.jobForm.get('qMontlyIncome');
	}
	get qMontlyExpenses() {
		return this.jobForm.get('qMontlyExpenses');
	}
	get childname() {
		return this.childForm.get('childname');
	}
	get childBirthDate() {
		return this.childForm.get('childBirthDate');
	}
	get childScholarShip() {
		return this.childForm.get('childScholarShip');
	}
	get childOccupation() {
		return this.childForm.get('childOccupation');
	}
	get jobWeekSchedule() {
		return this.jobScheduleForm.get('jobWeekSchedule');
	}
	get jobDailySchedule() {
		return this.jobScheduleForm.get('jobDailySchedule');
	}
	get famName() {
		return this.familyForm.get('famName');
	}
	get famBirthDate() {
		return this.familyForm.get('famBirthDate');
	}
	get famRelationShip() {
		return this.familyForm.get('famRelationShip');
	}
	get famOccupation() {
		return this.familyForm.get('famOccupation');
	}
	get refname() {
		return this.referenceForm.get('refname');
	}
	get refphone() {
		return this.referenceForm.get('refphone');
	}


  constructor(
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cvService: CVService
	) {
		this.activatedRoute.params.subscribe(params => {
			this.token= params.token;
		});
	}

  ngOnInit(): void {
		this.loadCV();
  }

	ngAfterViewInit() {

	}

	loadCV() {
		this.loading = true;
		this.cvService.getCV(this.token).subscribe(data => {
			console.log(data);
			this.loading = false;
			this.cv = data;
			this.setFields();
		}, error => {
			Swal.fire({
				type: 'error',
				html: `<p>Hubo un error al descargar la solicitud de empleo.</p> <p>Si crees que no es un error, intenta nuevamente más tarde.</p> <p>Error: ${error.error.message}</p>`
			});
			this.loading = false;
			console.log(error);
			this.router.navigate(['/pages/home']);
		})
	}

	setFields() {
		this.identifier.disable();
		if(this.cv.person?.email) {
			this.email.setValue(this.cv.person.email);
			this.email.disable();
		}
		if(this.cv.person?.name) {
			this.name.setValue(this.cv.person.name);
			this.name.disable();
		}
		if(this.cv.person?.fatherName) {
			this.fatherName.setValue(this.cv.person.fatherName);
			this.fatherName.disable();
		}
		if(this.cv.person?.motherName) {
			this.motherName.setValue(this.cv.person.motherName);
			this.motherName.disable();
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
	// console.log(field);
	let value = field.value;
	if(value === '' || !value) {
		return null;
	}
	value = value.toUpperCase();
	return RFC.test(value) ? null : {
		validRFC: true
	}
}
