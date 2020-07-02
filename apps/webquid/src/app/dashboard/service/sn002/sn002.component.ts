import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';

import { Identity } from '@wqshared/types/user.type';
import { JobPosition } from '@wqshared/types/job.type';
import {
	Display,
	DisplayGroups,
	DisplayWithCategory
} from '@wqshared/types/display.type';
import { UserService } from '@wqshared/services/user.service';
import { JobsService } from '@wqshared/services/jobs.service';
import { CommonService } from '@wqshared/services/common.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'webquid-sn002',
	templateUrl: './sn002.component.html',
	styleUrls: ['./sn002.component.scss']
})
export class Sn002Component implements OnInit {

	@Input() serviceid: string;

	jobPositions: JobPosition[] = [];
	jobPosFiltered: JobPosition[] = [];
	jobAreas: string[] = [];
	jobsList: boolean = false;
	requestForm = this.fb.group({
		causa: [null, [Validators.required]],
		puesto: ['', [Validators.required]],
		area: ['', [Validators.required]],
		lugarTrabajo: ['', [Validators.required]],
		numeroVacantes: [1, [
			Validators.required,
			Validators.min(1)
		]],
		horariosTrabajo: ['--'],
		funcionesPuesto: ['', [Validators.required]],
		generoPuesto: ['',[Validators.required]],
		edad: ['',[Validators.required]],
		estadoCivil: ['',[Validators.required]],
		estudiosProfesion: ['',[Validators.required]],
		experiencia: ['',[Validators.required]],
		experienciaEn: [''],
		competencias: ['',[Validators.required]],
		porcentajeIngles: [0,[
			Validators.max(100)
		]],
		disponibilidadViajar: [false],
		sueldoMinimo: [0],
		sueldoMaximo: [0],
		tipoContrato: ['', [Validators.required]],
		personaEntrevista: ['',[Validators.required]],
		comentarios: [''],
		sinHorario: [false],
		lunes: [true],
		martes: [true],
		miercoles: [true],
		jueves: [true],
		viernes: [true],
		sabado: [false],
		domingo: [false],
		lunBeg: ['9:00'],
		lunEnd: ['6:00'],
		lunBegMer: ['am'],
		lunEndMer: ['pm'],
		marBeg: ['9:00'],
		marEnd: ['6:00'],
		marBegMer: ['am'],
		marEndMer: ['pm'],
		mieBeg: ['9:00'],
		mieEnd: ['6:00'],
		mieBegMer: ['am'],
		mieEndMer: ['pm'],
		jueBeg: ['9:00'],
		jueEnd: ['6:00'],
		jueBegMer: ['am'],
		jueEndMer: ['pm'],
		vieBeg: ['9:00'],
		vieEnd: ['6:00'],
		vieBegMer: ['am'],
		vieEndMer: ['pm'],
		sabBeg: ['9:00'],
		sabEnd: ['1:00'],
		sabBegMer: ['am'],
		sabEndMer: ['pm'],
		domBeg: ['9:00'],
		domEnd: ['1:00'],
		domBegMer: ['am'],
		domEndMer: ['pm'],
	});



	horas = [
		'12:00',
		'12:30',
		'1:00',
		'1:30',
		'2:00',
		'2:30',
		'3:00',
		'3:30',
		'4:00',
		'4:30',
		'5:00',
		'5:30',
		'6:00',
		'6:30',
		'7:00',
		'7:30',
		'8:00',
		'8:30',
		'9:00',
		'9:30',
		'10:00',
		'10:30',
		'11:00',
		'11:30',
	];

	meridiano = [
		'am','pm'
	];



	matcher = new MyErrorStateMatcher();

	identity: Identity;
	experienciaValue: boolean = false;

	causas = [
		{
			value: 'Nueva creación',
			viewValue: 'Nueva creación'
		},{
			value: 'Por despido',
			viewValue: 'Por despido'
		},{
			value: 'Renuncia',
			viewValue: 'Renuncia'
		},{
			value: 'Incapacidad',
			viewValue: 'Incapacidad'
		},{
			value: 'Eventual',
			viewValue: 'Eventual'
		},{
			value: 'Por promoción',
			viewValue: 'Por promoción'
		}
	];

	lugarDeTrabajo = [
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

	generos = [
		{
			value: 'Cualquier género',
			viewValue: 'Cualquier género'
		},{
			value: 'Masculino',
			viewValue: 'Masculino'
		},{
			value: 'Femenino',
			viewValue: 'Femenino'
		}
	];

	estadosCivil = [
		{
			value: 'Casado',
			viewValue: 'Casado'
		},{
			value: 'Soltero',
			viewValue: 'Soltero'
		}
	];

	opcCompetencias = [
		{
			value: 'Liderazgo',
			viewValue: 'Liderazgo'
		},{
			value: 'Trabajo en equipo',
			viewValue: 'Trabajo en equipo'
		},{
			value: 'Apego a normas',
			viewValue: 'Apego a normas'
		},{
			value: 'Analítico',
			viewValue: 'Analítico'
		},{
			value: 'Formación de equipos de trabajo',
			viewValue: 'Formación de equipos de trabajo'
		},{
			value: 'Alcance de objetivos',
			viewValue: 'Alcance de objetivos'
		},{
			value: 'Compromiso',
			viewValue: 'Compromiso'
		},{
			value: 'Honestidad',
			viewValue: 'Honestidad'
		},{
			value: 'Manejo de valores',
			viewValue: 'Manejo'
		}
	];

	rangosEdad = [
		{
			value: '15-19 años',
			viewValue: '15-19 años'
		},{
			value: '20-24 años',
			viewValue: '20-24 años'
		},{
			value: '25-29 años',
			viewValue: '25-29 años'
		},{
			value: '20-34 años',
			viewValue: '30-34 años'
		},{
			value: '35-39 años',
			viewValue: '35-39 años'
		},{
			value: '40-44 años',
			viewValue: '40-44 años'
		},{
			value: '45-49 años',
			viewValue: '45-49 años'
		},{
			value: '50-54 años',
			viewValue: '50-54 años'
		},{
			value: '55-56 años',
			viewValue: '55-59 años'
		},{
			value: '60-64 años',
			viewValue: '60-64 años'
		},{
			value: '65-69 años',
			viewValue: '65-69 años'
		},{
			value: 'más de 70 años',
			viewValue: 'más de 70 años'
		}
	];

	exper = [
		{
			value: 'Sin experiencia',
			viewValue: 'Sin experiencia'
		},{
			value: '1-3 años',
			viewValue: '1-3 años'
		},{
			value: '3-6 años',
			viewValue: '3-6 años'
		},{
			value: 'Más de 6 años',
			viewValue: 'Más de 6 años'
		}
	]

	nivelesEstudios = [
		{
			value: 'Sin formación',
			viewValue: 'Sin formación'
		},{
			value: 'Primaria',
			viewValue: 'Primaria'
		},{
			value: 'Secundaria',
			viewValue: 'Secundaria'
		},{
			value: 'Preparatoria/Bachillerato',
			viewValue: 'Preparatoria/Bachillerato'
		},{
			value: 'Técnico superior',
			viewValue: 'Técnico superior'
		},{
			value: 'Licenciatura',
			viewValue: 'Licenciatura'
		},{
			value: 'Maestría',
			viewValue: 'Maestría'
		},{
			value: 'Doctorado',
			viewValue: 'Doctorado'
		}
	];

	tiposContrato = [
		{
			value: 'Planta',
			viewValue: 'Planta'
		},{
			value: 'Eventual',
			viewValue: 'Eventual'
		}
	];

	email: String = '';

	get causa() {
		return this.requestForm.get('causa');
	}
	get puesto() {
		return this.requestForm.get('puesto');
	}
	get area() {
		return this.requestForm.get('area');
	}
	get lugarTrabajo() {
		return this.requestForm.get('lugarTrabajo');
	}
	get numeroVacantes() {
		return this.requestForm.get('numeroVacantes');
	}
	get horariosTrabajo() {
		return this.requestForm.get('horariosTrabajo');
	}
	get funcionesPuesto() {
		return this.requestForm.get('funcionesPuesto');
	}
	get generoPuesto() {
		return this.requestForm.get('generoPuesto');
	}
	get edad() {
		return this.requestForm.get('edad');
	}
	get estadoCivil() {
		return this.requestForm.get('estadoCivil');
	}
	get estudiosProfesion() {
		return this.requestForm.get('estudiosProfesion');
	}
	get experienciaEn() {
		return this.requestForm.get('experienciaEn');
	}
	get porcentajeIngles() {
		return this.requestForm.get('porcentajeIngles');
	}
	get tipoContrato() {
		return this.requestForm.get('tipoContrato');
	}
	get experiencia() {
		return this.requestForm.get('experiencia');
	}
	get competencias() {
		return this.requestForm.get('competencias');
	}
	get disponibilidadViajar() {
		return this.requestForm.get('disponibilidadViajar');
	}
	get sueldoMinimo() {
		return this.requestForm.get('sueldoMinimo');
	}
	get sueldoMaximo() {
		return this.requestForm.get('sueldoMaximo');
	}
	get personaEntrevista() {
		return this.requestForm.get('personaEntrevista');
	}
	get comentarios() {
		return this.requestForm.get('comentarios');
	}
	get sinHorario() {
		return this.requestForm.get('sinHorario');
	}


	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private jobsService: JobsService,
		private commonService: CommonService,
		private router: Router
	) {
		this.identity = this.userService.getidentity();
		this.email = (this.identity && this.identity.person && this.identity.person.email) ? this.identity.person.email : '';
	}

	ngOnInit(): void {
		this.getJobs(true);
		if(this.email === '') {
			Swal.fire({
				type: 'warning',
				html: 'Tu perfil no tiene cuenta de correo, por lo que no puedes generar solicitudes todavía'
			});
			this.router.navigate(['/services']);
		}
	}

	submit(): void {
		this.getSchedule();
		this.validateAllFormFields(this.requestForm);
		if(this.requestForm.valid) {
			var submitForm: any = {
				quantity: 1,
				email: this.email,
				custom_fields: {
					causa_de_la_vacante: this.causa.value,
					puesto: this.puesto.value,
					area: this.area.value,
					lugar_de_trabajo: this.lugarTrabajo.value,
					numero_de_vacantes: +this.numeroVacantes.value,
					horarios_de_trabajo: this.horariosTrabajo.value,
					funciones_del_puesto: this.funcionesPuesto.value,
					genero_del_puesto: this.generoPuesto.value,
					edad: this.edad.value,
					estado_civil: this.estadoCivil.value,
					anos_de_experiencia_2: this.experiencia.value,
					experiencia_especifica_en: this.experienciaEn.value,
					nivel_de_estudios: this.estudiosProfesion.value,
					porcentaje_de_ingles: this.porcentajeIngles.value,
					disponibilidad_para_viajar: this.disponibilidadViajar.value,
					sueldo_minimo: this.sueldoMinimo.value,
					sueldo_maximo: this.sueldoMaximo.value,
					tipo_de_contrato: this.tipoContrato.value,
					quien_entrevistara_a_los_candidatos: this.personaEntrevista.value,
					comentarios: this.comentarios.value,
					liderazgo: (this.competencias.value.includes('Liderazgo')) ? true: false,
					trabajo_en_equipo: (this.competencias.value.includes('Trabajo en equipo')) ? true: false,
					apego_a_normas: (this.competencias.value.includes('Apego a normas')) ? true: false,
					analitico: (this.competencias.value.includes('Analítico')) ? true: false,
					formacion_de_equipos_de_trabajo: (this.competencias.value.includes('Formación de equipos de trabajo')) ? true: false,
					alcance_de_objetivos: (this.competencias.value.includes('Alcance de objetivos')) ? true: false,
					compromiso: (this.competencias.value.includes('Compromiso')) ? true: false,
					honestidad: (this.competencias.value.includes('Honestidad')) ? true: false,
					manejo_de_valores: (this.competencias.value.includes('Manejo de valores')) ? true: false
				}
			};
			if(submitForm.custom_fields.anos_de_experiencia_2 !== 'Sin experiencia') {
				submitForm.custom_fields.experiencia_especifica_en = this.experienciaEn.value;
			} else {
				delete submitForm.custom_fields.experiencia_especifica_en;
			}
			this.commonService.displayLog('SubmitForm',submitForm);
			this.commonService.displayLog('Service ID',this.serviceid);
			// console.log(submitForm);
			// console.log(this.serviceid);
			Swal.fire('Espera...');
			Swal.showLoading();
			this.userService.createServiceRequest('post',`/api/v2/service_catalog/items/${this.serviceid}/place_request`,submitForm).subscribe(data => {
				Swal.close();
				Swal.hideLoading();
				if(data && data.service_request) {
					Swal.fire({
						type: 'success',
						html: `Se ha generado una solicitud a tu nombre con el ticket número ${data.service_request.id}`
					});
				}
				this.requestForm.reset();
				this.router.navigate(['/services'])
			}, error => {
				Swal.close();
				Swal.hideLoading();
				Swal.fire({
					type: 'error',
					text: 'Ocurrió un error en el envio de la Solicitud. Intenta más tarde y si el problema persiste notifica a la mesa de soporte para resolverlo'
				});
				console.log(error);
			});
		} else {
			this.commonService.displayLog('requestForm',this.requestForm);
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los campos con error',
				timer: 2000,
				showConfirmButton: false
			});
		}
	}

	experienciaChange() {
		this.commonService.displayLog('Cambio de experiencia','Estamos cambiando el valor de experiencia')
		if(this.experiencia.value === "Sin experiencia") {
			this.experienciaEn.clearValidators();
		} else {
			this.experienciaEn.setValidators([Validators.required]);
		}
		this.experienciaEn.updateValueAndValidity();
	}

	getJobs(first?: boolean) {
		this.jobsService.listJobs().subscribe(data => {
			// console.log(data);
			this.jobPositions = data.map((job:any) => {
				return {
					name: job.name,
					place: job.place,
					functions: job.functions || '',
					area: job.area || ''
				}
			});
			this.jobPositions.sort((a,b) => (a.area > b.area) ? 1 : (a.area === b.area) ? ((a.name > b.name) ? 1: -1) : -1);
			this.jobAreas = [... new Set(this.jobPositions.map(pos => pos.area))];
			this.filterPositions(first);
			// console.group('Jobs')
			// console.log(this.jobPositions);
			// console.log(this.jobAreas);
			// console.log(this.jobPosFiltered);
			// console.groupEnd();
			this.jobsList = true;
		}, error => {
			console.log(error);
		})
	}

	filterPositions(first?: boolean){
		this.jobPosFiltered = this.jobPositions.filter(job => job.place === this.lugarTrabajo.value && job.area === this.area.value)
		this.puesto.setValue('');
		if(
			this.jobPosFiltered.length === 0 &&
			 !first &&
			 this.area.value !== '' &&
			 this.lugarTrabajo.value !== ''
		 ) {
			Swal.fire({
				type: 'warning',
				html: '<p>Las opciones que acabas de elegir no contiene puestos disponibles.</p> <p>Selecciona otro Lugar de Trabajo u otra Área.</p>'
			});
		}
	}

	fillJobFunctions() {
		const findPosition = this.jobPosFiltered.find(job => job.name === this.puesto.value);
		if(findPosition && findPosition.functions && Array.isArray(findPosition.functions)) {
			let newArray = findPosition.functions.map(func => '- ' + func);
			this.funcionesPuesto.setValue(newArray.join('\n'));
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

	getSchedule() {
		var horario = '';
		if(this.sinHorario.value) {
			horario = 'Sin horario';
		} else {
			if(this.requestForm.get('lunes').value) {
				horario = `${horario}Lunes: De ${this.requestForm.get('lunBeg').value}${this.requestForm.get('lunBegMer').value} a ${this.requestForm.get('lunEnd').value}${this.requestForm.get('lunEndMer').value}`
			}
			if(this.requestForm.get('martes').value) {
				horario = `${horario}\nMartes: De ${this.requestForm.get('marBeg').value}${this.requestForm.get('marBegMer').value} a ${this.requestForm.get('marEnd').value}${this.requestForm.get('marEndMer').value}`
			}
			if(this.requestForm.get('miercoles').value) {
				horario = `${horario}\nMiércoles: De ${this.requestForm.get('mieBeg').value}${this.requestForm.get('mieBegMer').value} a ${this.requestForm.get('mieEnd').value}${this.requestForm.get('mieEndMer').value}`
			}
			if(this.requestForm.get('jueves').value) {
				horario = `${horario}\nJueves: De ${this.requestForm.get('jueBeg').value}${this.requestForm.get('jueBegMer').value} a ${this.requestForm.get('jueEnd').value}${this.requestForm.get('jueEndMer').value}`
			}
			if(this.requestForm.get('viernes').value) {
				horario = `${horario}\nViernes: De ${this.requestForm.get('vieBeg').value}${this.requestForm.get('vieBegMer').value} a ${this.requestForm.get('vieEnd').value}${this.requestForm.get('vieEndMer').value}`
			}
			if(this.requestForm.get('sabado').value) {
				horario = `${horario}\nSábado: De ${this.requestForm.get('sabBeg').value}${this.requestForm.get('sabBegMer').value} a ${this.requestForm.get('sabEnd').value}${this.requestForm.get('sabEndMer').value}`
			}
			if(this.requestForm.get('domingo').value) {
				horario = `${horario}\nDomingo: De ${this.requestForm.get('domBeg').value}${this.requestForm.get('domBegMer').value} a ${this.requestForm.get('domEnd').value}${this.requestForm.get('domEndMer').value}`
			}
		}
		this.horariosTrabajo.setValue(horario);
		// console.log(this.horariosTrabajo);
	}

}
