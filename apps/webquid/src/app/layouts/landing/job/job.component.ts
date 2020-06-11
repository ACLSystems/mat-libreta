import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';

declare const $:any;

import { CVService } from '../services/cv.service';
import {
	STATES,
	COUNTRIES
} from '@wqshared/enums/states.enum';
import {
	GENDER,
	EDOCIVIL,
	ALCOHOLFREC,
	TOBACCOFREC
} from '@wqshared/enums/jobs.enum';
import {
	WEEKDAYS,
	TIMEUNITS
} from '@wqshared/enums/time.enum';

import {
	WorkInfo,
	Reference,
	Family,
	Child,
	Study
} from '@wqshared/types/job.type';

registerLocaleData(localeEs,'es-MX');
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

	// Propiedades generales

	loading: boolean = false;
	token: string|null = null;
	cv: any;
	job: string = '';
	place: string = '';

	edoCivil = EDOCIVIL;
	semana = WEEKDAYS;
	alcoholfrec = ALCOHOLFREC;
	tobaccofrec = TOBACCOFREC;
	states = STATES;
	units = TIMEUNITS;
	genderSelect = GENDER;
	countries = COUNTRIES;
	sendForm: any;

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
		this.cvService.getCV

		(this.token).subscribe(data => {
			this.loading = false;
			this.cv = data;
			// console.log(this.cv);
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

	confirmJobSubmit() {
		// Validaciones finales
		// this.validateAllFormFields(this.jobForm);
		// if(!this.formValid('Datos Personales',this.jobForm)) {
		// 	return;
		// }
		this.validateAllFormFields(this.addressForm);
		if(!this.formValid('Domicilio Actual',this.addressForm)) {
			return;
		}
		if(this.studies.length === 0) {
			Swal.fire({
				type: 'error',
				text: 'No incluiste tus Datos Académicos. Revisa nuevamente'
			});
			return;
		}
		this.validateAllFormFields(this.healthForm);
		if(!this.formValid('Habilidades y hábitos de salud',this.healthForm)) {
			return;
		}
		this.validateAllFormFields(this.qualityForm);
		if(!this.formValid('Habilidades y hábitos de salud',this.qualityForm)) {
			return;
		}
		if(this.references.length < 3) {
			Swal.fire({
				type: 'error',
				text: 'Se requieren al menos 3 referencias personales. Revisa nuevamente'
			});
			return;
		}
		this.sendJobForm();
	}

	sendJobForm() {
		// Datos Personales
		Swal.fire({
			type: 'question',
			text: '¿Estás seguro',
			showConfirmButton: true,
			confirmButtonColor: 'green',
			confirmButtonText: 'Sí, estoy seguro',
			showCancelButton: true,
			cancelButtonColor: 'red',
			cancelButtonText: 'Daré una revisada más'
		}).then(result => {
			if(result.value) {
				Swal.fire({
					type: 'question',
					text: 'Una última pregunta: ¿Cómo te enteraste de esta oportunidad?',
					input: 'select',
					showCancelButton: false,
					showConfirmButton: true,
					confirmButtonColor: 'green',
					confirmButtonText: 'Enviar',
					inputOptions: {
						'Redes sociales':'Redes sociales',
						'Periódicos': 'Periódicos',
						'Revistas': 'Revistas',
						'Me contactaron por teléfono': 'Me contactaron por teléfono',
						'Me contactaron vía email': 'Me contactaron vía email',
						'Me comentó un conocido': 'Me comentó un conocido',
						'Otros': 'Otros'
					}
				}).then(result2 => {
					this.sendForm = {
						token: this.token,
						birthDate: this.birthDate.value,
						birthPlace: this.birthPlace.value,
						gender: this.gender.value,
						phone: this.phone.value,
						cellPhone: this.cellPhone.value,
						messagePhone: this.messagePhone.value,
						civil: this.civil.value,
						currentAddress: {
							line1: this.adLine1.value,
							line2: this.adLine2.value,
							postalCode: this.adPostalCode.value,
							locality: this.adLocality.value,
							city: this.adCity.value,
							country: this.adCountry.value
						},
						workInfo: [...this.workInfo],
						academicInfo: [...this.studies],
						health: {
							hobbies: this.hHobbies.value,
							alcohol: (this.hAlcoholFrec.value === 'No bebo') ? false : true,
							alcoholFrecuency: this.hAlcoholFrec.value,
							tobacco: (this.hTobaccoFrec.value === 'No fumo') ? false : true,
							tobaccoFrecuency: this.hTobaccoFrec.value,
							mainStrength: this.hMainStrength.value,
							mainOpportunityAreas: this.hMainOppAreas.value
						},
						tools: [...this.hTools.value.split(',')],
						qualityLife: {
							distanceToHomeTime: +this.qDistanceToHome.value,
							distanceToHomeUnits: this.qDistanceHomeUnits.value,
							dailyTransportRate: this.qOwnAutomobileValue ? 0 : +this.qDailyTransportRate.value,
							gasWeeklyRate: this.qOwnAutomobileValue ? +this.qGasWeeklyRate : 0,
							ownAutomobile: this.qOwnAutomobile.value,
							ownHouse: this.qOwnHouse.value,
							rent: this.qRent.value,
							familyHouse: this.qFamilyHouse.value,
							mortage: this.qMortage.value,
							mortageCost: this.qMortageValue ? +this.qMortageCost : 0,
							rentCost: this.qRentValue ? +this.qRentCost : 0,
							infonavitRetention: this.qInfonavitRetention.value,
							placeShift: this.qPlaceShiftValue,
							whyPlaceShift: this.qPlaceShiftValue ? this.qWhyPlaceShift : '',
							monthlyIncome: this.qMontlyIncome,
							monthlyExpenses: this.qMontlyExpenses
						},
						children: [...this.children],
						family: [...this.family],
						references: [...this.references],
						findVacancy: result2
					}
					Swal.fire('Espera...');
					Swal.showLoading();
					this.cvService.updateCV(this.sendForm).subscribe(data => {
						if(data && data.message && data.message.includes('Hoja de vida actualizada')) {
							Swal.hideLoading();
							Swal.close();
							Swal.fire({
								type: 'success',
								text: 'Tu solicitud ha sido recibida con éxito'
							});
						}
					}, error => {
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'error',
							text: 'Hubo un error al tratar de enviar tu solicitud'
						});
						console.log(error);
					});
				});
			}
		});


	}

	setFields() {
		if(this.cv.job.length > 0) {
			this.job = this.cv.job[this.cv.job.length - 1].name;
			this.place = this.cv.job[this.cv.job.length - 1].place;
		}
		if(this.cv.identifier) {
			this.identifier.setValue(this.cv.identifier);
			this.identifier.disable();
		}
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
		this.adCountry.setValue('México');
	}

	// Datos Personales ------------------------------------------

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

		]],
		jobPlace: ['',[

		]],
		childrenNumber: [0,[

		]],
		civil: ['',[
			Validators.required
		]],
		birthPlace: ['',[
			Validators.required
		]],
		birthDate: ['',[
			Validators.required,
			mustBeValidDate
		]],
		phone: ['',[
			Validators.required
		]],
		cellPhone: ['',[
			Validators.required
		]],
		messagePhone: ['',[
			Validators.required
		]]
	});

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
	get birthDate() {
		return this.jobForm.get('birthDate');
	}
	get birthPlace() {
		return this.jobForm.get('birthPlace');
	}
	get gender() {
		return this.jobForm.get('gender');
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

	// Domicilio actual ------------------------------------------

	otherCountry: boolean = false;
	addressForm = this.fb.group({
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
		adCountry: ['México',[
			Validators.required
		]]
	});

	get adLine1() {
		return this.addressForm.get('adLine1');
	}
	get adLine2() {
		return this.addressForm.get('adLine2');
	}
	get adPostalCode() {
		return this.addressForm.get('adPostalCode');
	}
	get adLocality() {
		return this.addressForm.get('adLocality');
	}
	get adCity() {
		return this.addressForm.get('adCity');
	}
	get adState() {
		return this.addressForm.get('adState');
	}
	get adCountry() {
		return this.addressForm.get('adCountry');
	}

	changeCountry() {
		if(this.adCountry.value === 'México') {
			return;
		} else {
			this.adCountry.setValue('');
			this.otherCountry = !this.otherCountry;
		}
	}

	// Datos laborales ------------------------------------------

	workInfo: WorkInfo[] = [];
	wiCurrentValue: boolean = false;

	workInfoForm = this.fb.group({
		wiCompanyName: ['',[
			Validators.required
		]],
		wiBeginDate: ['',[
			Validators.required,
			mustBeValidDate
		]],
		wiCurrent: [false],
		wiEndDate: ['',[
			Validators.required,
			mustBeValidDate
		]],
		wiInitialJob: ['',[
			Validators.required
		]],
		wiFinalJob: ['',[
			Validators.required
		]],
		wiSalary: [0,[
			Validators.required,
			Validators.min(1)
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
	}, {
		validator: [
			this.datesCoherent('wiBeginDate','wiEndDate', 'wiCurrent')
		]
	});

	jobScheduleForm = this.fb.group({
		jobWeekSchedule: ['',[
			Validators.required
		]],
		jobDailySchedule: ['',[
			Validators.required
		]],
	});

	get jobWeekSchedule() {
		return this.jobScheduleForm.get('jobWeekSchedule');
	}
	get jobDailySchedule() {
		return this.jobScheduleForm.get('jobDailySchedule');
	}

	get wiCompanyName() {
		return this.workInfoForm.get('wiCompanyName');
	}
	get wiCurrent() {
		return this.workInfoForm.get('wiCurrent');
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

	wiCurrentChange() {
		this.wiCurrentValue = !this.wiCurrentValue;
		if(this.wiCurrentValue) {
			this.removeWIValidators();
		} else {
			this.setWIValidators();
		}
	}

	saveWork() {
		this.validateAllFormFields(this.workInfoForm);
		// console.log(this.workInfoForm);
		if(this.formValid('Datos Laborales',this.workInfoForm)) {
			this.workInfo.push({
				companyName: this.wiCompanyName.value,
				beginDate: this.wiBeginDate.value,
				endDate: this.wiEndDate.value || null,
				current: this.wiCurrent.value,
				initialJob: this.wiInitialJob.value,
				finalJob: this.wiFinalJob.value,
				salary: this.wiSalary.value,
				reasonToLeave: this.wiReasonToLeave.value || null,
				bossName: this.wiBossName.value,
				companyPhone: this.wiCompanyPhone.value,
				referencePhone: this.wiReferencePhone.value
			});
			this.workInfoForm.reset();
			this.wiCurrentValue = false;
			this.setWIValidators();
			// $('#refName').focus();
			// this.refPhoneElement.nativeElement.focus();
		}
	}

	editWork(index:number) {
		this.wiCompanyName.setValue(this.workInfo[index].companyName);
		this.wiBeginDate.setValue(this.workInfo[index].beginDate);
		this.wiEndDate.setValue(this.workInfo[index].endDate || '');
		this.wiInitialJob.setValue(this.workInfo[index].initialJob);
		this.wiFinalJob.setValue(this.workInfo[index].finalJob);
		this.wiSalary.setValue(this.workInfo[index].salary);
		this.wiReasonToLeave.setValue(this.workInfo[index].reasonToLeave || '');
		this.wiBossName.setValue(this.workInfo[index].bossName);
		this.wiCompanyPhone.setValue(this.workInfo[index].companyPhone);
		this.wiReferencePhone.setValue(this.workInfo[index].referencePhone);
		this.removeWork(index);
	}

	removeWork(index:number) {
		this.workInfo = removeItemFromArray(this.workInfo,index);
	}

	setWIValidators() {
		this.wiEndDate.setValidators([
			Validators.required,
			mustBeValidDate
		]);
		this.wiReasonToLeave.setValidators([Validators.required]);
		this.updateWIValidators();
	}
	removeWIValidators() {
		this.wiEndDate.clearValidators();
		this.wiReasonToLeave.clearValidators();
		this.updateWIValidators();
	}
	updateWIValidators() {
		this.wiEndDate.updateValueAndValidity();
		this.wiReasonToLeave.updateValueAndValidity();
	}

	// Datos Académicos ------------------------------------------

	studies: Study[] = [];
	aiCurrentValue: boolean = false;
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
			Validators.required,
			mustBeValidDate
		]],
		aiEndDate: ['',[
			Validators.required,
			mustBeValidDate
		]],
		aiCurrent: [false]
	}, {
		validator: [
			this.datesCoherent('aiBeginDate','aiEndDate', 'aiCurrent')
		]
	});

	get aiCurrent() {
		return this.academicForm.get('aiCurrent');
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

	saveStudy() {
		this.validateAllFormFields(this.academicForm);
		// console.log(this.academicForm);
		if(this.formValid('Datos Académicos',this.academicForm)) {
			this.studies.push({
				grade: this.aiStudies.value,
				institute: this.aiInstitute.value,
				beginDate: new Date(this.aiBeginDate.value),
			 	diploma: this.aiDiplomas.value,
				certificate: this.aiCertificates.value,
				current: (this.aiCurrent.value) ? true : false,
				endDate: (this.aiEndDate.value && this.aiEndDate.value !== '') ? new Date(this.aiEndDate.value) : null
			});
			this.academicForm.reset();
			this.aiCurrentValue = false;
			this.setAIValidators();
			// $('#refName').focus();
			// this.refPhoneElement.nativeElement.focus();
		}
	}

	editStudy(index:number) {
		this.aiStudies.setValue(this.studies[index].grade);
		this.aiInstitute.setValue(this.studies[index].institute);
		this.aiBeginDate.setValue(this.studies[index].beginDate);
		this.aiCurrent.setValue(this.studies[index].current);
		this.aiCertificates.setValue(this.studies[index].certificate);
		this.aiDiplomas.setValue(this.studies[index].diploma);
		this.aiEndDate.setValue(this.studies[index].endDate);
		this.aiCurrentValue = this.studies[index].current;
		this.removeStudy(index);
	}

	removeStudy(index:number) {
		this.studies = removeItemFromArray(this.studies,index);
	}

	aiCurrentChange() {
		this.aiCurrentValue = !this.aiCurrentValue;
		if(this.aiCurrentValue) {
			this.removeAIValidators();
		} else {
			this.setAIValidators();
		}
	}
	setAIValidators() {
		this.aiCertificates.setValidators([Validators.required]);
		this.aiDiplomas.setValidators([Validators.required]);
		this.aiEndDate.setValidators([Validators.required]);
		this.updateAIValidators();
	}
	removeAIValidators() {
		this.aiCertificates.clearValidators();
		this.aiDiplomas.clearValidators();
		this.aiEndDate.clearValidators();
		this.updateAIValidators();
	}
	updateAIValidators() {
		this.aiCertificates.updateValueAndValidity();
		this.aiDiplomas.updateValueAndValidity();
		this.aiEndDate.updateValueAndValidity();
	}

	// Salud ------------------------------------------

	healthForm= this.fb.group({
		hHobbies: ['',[
			Validators.required
		]],
		hAlcoholFrec: ['',[
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
		hTools: ['',[
			Validators.required
		]]
	});

	get hHobbies() {
		return this.healthForm.get('hHobbies');
	}
	get hAlcoholFrec() {
		return this.healthForm.get('hAlcoholFrec');
	}
	get hTobaccoFrec() {
		return this.healthForm.get('hTobaccoFrec');
	}
	get hMainStrength() {
		return this.healthForm.get('hMainStrength');
	}
	get hMainOppAreas() {
		return this.healthForm.get('hMainOppAreas');
	}
	get hTools() {
		return this.healthForm.get('hTools');
	}


	// Calidad de Vida ------------------------------------------

	qMortageValue: boolean = false;
	qRentValue: boolean = false
	qOwnAutomobileValue: boolean = false;
	qPlaceShiftValue: boolean = false;

	qualityForm= this.fb.group({
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

		]],
		qOwnAutomobile: [false],
		qOwnHouse: [false],
		qRent: [false],
		qFamilyHouse: [false],
		qMortage: [false],
		qMortageCost: ['',[

		]],
		qRentCost: ['',[

		]],
		qInfonavitRetention: ['',[

		]],
		qPlaceShift: [false],
		qWhyPlaceShift: ['',[

		]],
		qMontlyIncome: [0,[
			Validators.required,
			Validators.min(0)
		]],
		qMontlyExpenses: [0,[
			Validators.required,
			Validators.min(0)
		]]
	});

	get qDistanceToHome() {
		return this.qualityForm.get('qDistanceToHome');
	}
	get qDistanceHomeUnits() {
		return this.qualityForm.get('qDistanceHomeUnits');
	}
	get qDailyTransportRate() {
		return this.qualityForm.get('qDailyTransportRate');
	}
	get qGasWeeklyRate() {
		return this.qualityForm.get('qGasWeeklyRate');
	}
	get qOwnAutomobile() {
		return this.qualityForm.get('qOwnAutomobile');
	}
	get qOwnHouse() {
		return this.qualityForm.get('qOwnHouse');
	}
	get qRent() {
		return this.qualityForm.get('qRent');
	}
	get qFamilyHouse() {
		return this.qualityForm.get('qFamilyHouse');
	}
	get qMortage() {
		return this.qualityForm.get('qMortage');
	}
	get qMortageCost() {
		return this.qualityForm.get('qMortageCost');
	}
	get qRentCost() {
		return this.qualityForm.get('qRentCost');
	}
	get qInfonavitRetention() {
		return this.qualityForm.get('qInfonavitRetention');
	}
	get qPlaceShift() {
		return this.qualityForm.get('qPlaceShift');
	}
	get qWhyPlaceShift() {
		return this.qualityForm.get('qWhyPlaceShift');
	}
	get qMontlyIncome() {
		return this.jobForm.get('qMontlyIncome');
	}
	get qMontlyExpenses() {
		return this.qualityForm.get('qMontlyExpenses');
	}

	qMortageChange() {
		this.qMortageValue = !this.qMortageValue;
		if(this.qMortageValue) {
			this.qMortageCost.setValidators([Validators.required]);
		} else {
			this.qMortageCost.clearValidators();
		}
		this.qMortageCost.updateValueAndValidity();
	}

	qRentChange() {
		this.qRentValue = !this.qRentValue;
		if(this.qRentValue) {
			this.qRentCost.setValidators([Validators.required]);
		} else {
			this.qRentCost.clearValidators();
		}
		this.qRentCost.updateValueAndValidity();
	}
	qAutoChange() {
		this.qOwnAutomobileValue = !this.qOwnAutomobileValue;
		if(this.qOwnAutomobileValue ) {
			this.qGasWeeklyRate.setValidators([Validators.required, Validators.min(0)]);
			this.qDailyTransportRate.clearValidators();
		} else {
			this.qDailyTransportRate.setValidators([Validators.required, Validators.min(0)]);
			this.qGasWeeklyRate.clearValidators();
		}
		this.qGasWeeklyRate.updateValueAndValidity();
	}
	qPlaceShiftChange() {
		this.qPlaceShiftValue = !this.qPlaceShiftValue;
		if(this.qPlaceShiftValue) {
			this.qWhyPlaceShift.setValidators([Validators.required]);
		} else {
			this.qWhyPlaceShift.clearValidators();
		}
		this.qWhyPlaceShift.updateValueAndValidity();
	}

	// Hijos ------------------------------------------

	children: Child[] = [];

	childForm = this.fb.group({
		childname: ['',[
			Validators.required
		]],
		childBirthDate: ['',[
			Validators.required,
			mustBeValidDate
		]],
		childScholarShip: ['',[
			Validators.required
		]],
		childOccupation: ['',[
			Validators.required
		]]
	});

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

	saveChild() {
		this.validateAllFormFields(this.childForm);
		if(this.formValid('Hijos',this.childForm)) {
			this.children.push({
				name: this.childname.value,
				birthDate: new Date(this.childBirthDate.value),
				scholarShip: this.childScholarShip.value,
				occupation: this.childOccupation.value
			});
			this.childForm.reset();
			// $('#refName').focus();
			// this.refPhoneElement.nativeElement.focus();
		}
	}

	editChild(index:number) {
		this.childname.setValue(this.children[index].name);
		this.childBirthDate.setValue(this.children[index].birthDate);
		this.childScholarShip.setValue(this.children[index].scholarShip);
		this.childOccupation.setValue(this.children[index].occupation);
		this.removeChild(index);
	}

	removeChild(index:number) {
		this.children= removeItemFromArray(this.children,index);
	}

	// Familia / Personas con las que Vivo ------------------------------------------

	family: Family[] = [];

	familyForm = this.fb.group({
		famName: ['',[
			Validators.required
		]],
		famBirthDate: ['',[
			Validators.required,
			mustBeValidDate
		]],
		famRelationShip: ['',[
			Validators.required
		]],
		famOccupation: ['',[
			Validators.required
		]]
	});

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

	saveFamily() {
		this.validateAllFormFields(this.familyForm);
		if(this.formValid('Familiares/Personas que viven contigo',this.familyForm)) {
			const now = new Date();
			if(this.famBirthDate.value > now) {
				Swal.fire({
					type: 'error',
					text: 'La edad ingresada no es válida'
				});
				return;
			}
			this.family.push({
				name: this.famName.value,
				birthDate: new Date(this.famBirthDate.value),
				relationship: this.famRelationShip.value,
				occupation: this.famOccupation.value
			});
			this.familyForm.reset();
			// $('#refName').focus();
			// this.refPhoneElement.nativeElement.focus();
		}
	}

	editFamily(index:number) {
		this.famName.setValue(this.family[index].name);
		this.famBirthDate.setValue(this.family[index].birthDate);
		this.famRelationShip.setValue(this.family[index].relationship);
		this.famOccupation.setValue(this.family[index].occupation);
		this.removeFamily(index);
	}

	removeFamily(index:number) {
		this.family = removeItemFromArray(this.family,index);
	}

	// Referencias personales ------------------------------

	references: Reference[] = [];

	referenceForm = this.fb.group({
		refname: ['',[
			Validators.required
		]],
		refphone: ['',[
			Validators.required
		]]
	});


	get refname() {
		return this.referenceForm.get('refname');
	}
	get refphone() {
		return this.referenceForm.get('refphone');
	}

	saveReference() {
		this.validateAllFormFields(this.referenceForm);
		if(this.formValid('Referencias Personales',this.referenceForm)) {
			this.references.push({
				name: this.refname.value,
				phone: this.refphone.value
			});
			this.referenceForm.reset();
			$('#refName').focus();
			// this.refPhoneElement.nativeElement.focus();
		}
	}

	editReference(index:number) {
		this.refname.setValue(this.references[index].name);
		this.refphone.setValue(this.references[index].phone);
		this.removeReference(index);
	}

	removeReference(index:number) {
		this.references = removeItemFromArray(this.references,index);
	}

	// Métodos

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

	formValid(formName: string, form: FormGroup) {
		this.validateAllFormFields(form);
		if(!form.valid) {
			// console.log(form);
			const controls = form.controls;
			var invalid = `<br>----${formName}----`;
			for(const name in controls) {
				if(controls[name].invalid) {
					invalid = invalid + '<br>' + getName(name);
				}
			}
			Swal.fire({
				type: 'error',
				html: `Por favor revisa los campos con errores: ${invalid}`
			});
			return false;
		}
		return true;
	}

	datesCoherent(beginDate: string, endDate: string, current:string) {
		return (formGroup: FormGroup) => {
			const beginControl = formGroup.controls[beginDate];
			const endControl = formGroup.controls[endDate];
			const currentControl = formGroup.controls[current];
			if(endControl.errors && !endControl.errors.datesCoherent) {
				return;
			}
			if(currentControl.value) {
				return;
			}
			if(beginControl.value >= endControl.value) {
				endControl.setErrors({ datesCoherent: true});
			} else {
				endControl.setErrors(null);
			}
		}
	}

}

// Funciones privadas
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

function mustBeValidDate(field: FormControl) {
	let now = new Date();
	// console.log(field);
	if(field.value === '' || !field.value) {
		return null;
	}
	let value = new Date(field.value);
	return (value < now) ? null : {
		validDate: true
	}
}

function removeItemFromArray(array:any[], index:number) {
	if(!Array.isArray(array)) {
		return array;
	}
	if(array.length === 0) {
		return array;
	}
	const tempArray = [...array];
	return tempArray.slice(0,index).concat(tempArray.slice(index+1,tempArray.length));
}

function getName(control:string) {
	const controls = {
		birthDate: 'Fecha de nacimiento',
		birthPlace: 'Lugar de nacimiento',
		gender: 'Género',
		phone: 'Teléfono fijo',
		cellPhone: 'Celular',
		messagePhone: 'Teléfono de recados',
		civil: 'Estado Civil',
		adLine1: 'Dirección',
		adLine2: 'Colonia',
		adPostalCode: 'Código Postal',
		adLocality: 'Municipio/Localidad',
		adCity: 'Ciudad',
		adState: 'Estado',
		adCountry: 'País',
		hHobbies: '¿Cuáles son tus pasatiempos?',
		hAlcoholFrec: '¿Con qué frecuencia bebes alcohol?',
		hTobaccoFrec: '¿Con qué frecuencia fumas?',
		hMainStrength: '¿Cuál consideras que es tu principal fortaleza?',
		hMainOppAreas: '¿Cuál consideras que es tu principal área de oportunidad?',
		hTools: '¿Cuáles son tus habilidades?',
		qDistanceToHome: '¿Cuánto tiempo haces de tu casa al trabajo?',
		qDistanceHomeUnits: '¿Cuánto tiempo haces de tu casa al trabajo? señala horas o minutos',
		qDailyTransportRate: '¿Cuánto gastas en transporte diariamente',
		qGasWeeklyRate: 'Cuánto gastas a la semana de gasolina',
		qOwnAutomobile: 'Tengo Auto Propio',
		qOwnHouse: 'Tengo Casa Propia',
		qRent: 'Rento',
		qFamilyHouse: 'Vivo en casa de un familiar',
		qMortage: 'Pago Hipoteca',
		qMortageCost: '¿Cuánto gastas el mes en la Hipoteca?',
		qRentCost: '¿Cuánto gastas al mes de renta?',
		qInfonavitRetention: 'Tengo Crédito Infonavit',
		qPlaceShift: '¿Estás dispuesto a cambiar de residencia?',
		qWhyPlaceShift: '¿Porqué estarías dispuesto?',
		qMontlyIncome: '¿A cuánto ascienden tus ingresos mensuales?',
		qMontlyExpenses: '¿A cuánto ascienden tus gastos mensuales?',
		wiCompanyName: 'Empresa',
		wiBeginDate: 'Fecha de Inicio',
		wiEndDate: 'Fecha de término',
		wiInitialJob: 'Puesto inicial',
		wiFinalJob: 'Puesto final',
		wiSalary: 'Ultimo sueldo',
		wiReasonToLeave: 'Motivo de separación',
		wiBossName: 'Jefe Directo',
		wiCompanyPhone: 'Teléfono de la empresa',
		wiReferencePhone: 'Teléfono de referencias laborales',
		aiStudies: 'Grado de estudios',
		aiInstitute: 'Nombre de la Institución Académica',
		aiBeginDate: 'Fecha de Inicio',
		aiEndDate: 'Fecha de Finalización',
		aiCertificates: 'Título obtenido',
		aiDiplomas: 'Diplomas o certificaciones',
		childname: 'Nombre completo',
		childBirthDate: 'Fecha de nacimiento',
		childScholarShip: 'Escolaridad',
		childOccupation: 'Ocupación',
		famName: 'Nombre completo',
		famBirthDate: 'Fecha de nacimiento',
		famRelationShip: 'Relación',
		famOccupation: 'Ocupación'
	};
	return controls[control];
}
