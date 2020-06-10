import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';

import { UserService } from '@wqshared/services/user.service';
import { JobsService } from '@wqshared/services/jobs.service';
import { Identity, Roles } from '@wqshared/types/user.type';

import { DtOptions } from '@mat-libreta/shared';

import {
	Display,
	DisplayGroups,
	DisplayWithCategory
} from '@wqshared/types/display.type';

registerLocaleData(localeEs,'es-MX');

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
  selector: 'mat-libreta-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

	matcher = new MyErrorStateMatcher();
	loading: boolean = false;
	loadingVacancy: boolean = false;
	companiesList: boolean = false;
	jobsList: boolean = false;
	identity: Identity;
	roles: Roles;
	jobDisplay: boolean = false;
	companies: Display[] = [];
	jobs: DisplayWithCategory[] = [];
	jobCategories: DisplayGroups[] = [];
	candidates: any[] = [];
	dtOptions = DtOptions;
	jobPlaces: Display[] = [
		{
			value: 'Piedras Negras',
			viewValue: 'Piedras Negras'
		},{
			value: 'Patio Torreón',
			viewValue: 'Patio Torreón'
		},{
			value: 'Patio Acuña',
			viewValue: 'Patio Acuña'
		}
	];

	jobCreateForm = this.fb.group({
		nameJob: ['',[
			Validators.required
		]],
		jobCategory: ['', [
			Validators.required
		]],
	});

	jobForm = this.fb.group({
		ticket: [0,[
			Validators.required,
			Validators.min(1)
		]],
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
		jobName: ['',[
			Validators.required
		]],
		jobPlace: ['',[
			Validators.required
		]],
		company: ['',[
			Validators.required
		]]
	});
	tableHeader: string[];

	get ticket() {
		return this.jobForm.get('ticket');
	}

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

	get company() {
		return this.jobForm.get('company');
	}

	get nameJob() {
		return this.jobCreateForm.get('nameJob');
	}

	get jobCategory() {
		return this.jobCreateForm.get('jobCategory');
	}

  constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private jobsService: JobsService
	) {
		this.identity = this.userService.getidentity();
		if(this.identity) {
			this.roles = this.identity.roles;
		}
		this.tableHeader = [
			'#',
			'Ticket',
			'Candidato',
			'Puesto/Plaza',
			'Creado',
			'Status'
		];
	}

  ngOnInit(): void {
		const {
			isAdmin,
			isBillAdmin,
			isOperator,
			isTechAdmin
		} = this.roles;
		if(isAdmin || isBillAdmin || isOperator || isTechAdmin) {
			this.getCompanies();
			this.getJobs();
		}
		this.loadVacancy();
  }

	loadVacancy() {
		this.loadingVacancy = true;
		Swal.fire('Cargando candidatos. Espera...');
		Swal.showLoading();
		this.jobsService.getCVs().subscribe((data:any)=>{
			console.log(data);
			if(data && data.length > 0) {
				this.candidates = [...data];
			} else {
				this.candidates = [];
			}
			this.loadingVacancy = false;
			Swal.hideLoading();
			Swal.close();
		}, error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				text: `Hubo un error al intentar la carga: ${error.error.message}`
			})
		});
	}

	create() {
		// console.log('Guardar y crear nuevo');
		Swal.fire('Espera...');
		Swal.showLoading();
		this.validateAllFormFields(this.jobForm);
		if(!this.jobForm.valid) {
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los errores',
				timer: 2000,
				showConfirmButton: false
			});
			return;
		}
		const cv = {
			identifier: this.identifier.value,
			name: this.name.value,
			fatherName: this.fatherName.value,
			motherName: this.motherName.value,
			email: this.email.value,
			jobName: this.jobName.value,
			jobPlace: this.jobPlace.value,
			request: this.ticket.value,
			companies: [{
				company: this.company.value
			}],
		};
		console.log(cv);
		this.jobsService.createCV(cv).subscribe((data:any) => {
			Swal.hideLoading();
			Swal.close();
			if(data && data.message && data.message.includes('Se ha enviado correo a ')) {
				Swal.fire({
					type: 'success',
					text: `${data.message}`
				});
			} else {
				Swal.fire({
					type: 'warning',
					text: data.message
				});
			}
			this.jobForm.reset();
			// console.log(this.jobForm);
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				html: `<p>Ocurrió un error la creación del puesto. Revisa la solicitud o espera unos minutos y reintenta</p><p>Error: ${error.error.message}</p>`
			});
			Swal.hideLoading();
			Swal.close();
		});
	}

	openJobCard() {
		console.log('Abrir tarjeta de creación de puesto');
		this.jobDisplay = true;
	}

	closeJobDisplay() {
		this.jobDisplay = false;
	}

	close() {
		console.log('Cerrando');
	}

	saveJob() {
		this.validateAllFormFields(this.jobCreateForm);
		if(!this.jobCreateForm.valid) {
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los errores',
				timer: 2000,
				showConfirmButton: false
			});
			return;
		}
		this.jobsService.createJob(this.nameJob.value,this.jobCategory.value).subscribe((data:any) => {
			console.log(data);
			if(data && data.message && data.message.includes('ya había sido creado anteriormente')) {
				Swal.fire({
					type: 'warning',
					text: data.message
				});
			} else {
				Swal.fire({
					type: 'success',
					text: 'Puesto creado',
					timer: 1500,
					showConfirmButton: false
				});
			}
			this.jobCreateForm.reset();
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				html: `<p>Ocurrió un error la creación del puesto. Espera unos minutos y reintenta</p><p>Error: ${error.error.message}</p>`
			});
		});
	}


	getJobs() {
		this.jobsService.listJobs().subscribe(data => {
			// console.log(data);
			this.jobs = data.map((job:any) => {
				return {
					value: job.name,
					viewValue: job.name,
					category: job.category,
					functions: job.functions || ''
				}
			});
			const categories = [...new Set(this.jobs.map(job => job.category))];
			for(let cat of categories) {
				const jobCats = this.jobs.filter(job => job.category === cat);
				this.jobCategories.push({
					name: cat,
					job: [...jobCats]
				});
			}
			// console.log(this.jobs);
			// console.log(this.jobCategories);
			this.jobsList = true;
		}, error => {
			console.log(error);
		})
	}

	getCompanies() {
		this.jobsService.searchCompanies().subscribe(data => {
			// console.log(data);
			if(data && data.message && data.message.includes('No existen empresas con ese criterio de')) {
				this.companies = [];
			} else {
				this.companies = data.map((company: any) => {
					return {
						value: company._id,
						viewValue: company.name
					}
				});
			}
			// console.log(this.companies);
			this.companiesList = true;
		},error => {
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
