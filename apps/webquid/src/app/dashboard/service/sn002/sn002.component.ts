import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';

import { Identity } from '@wqshared/types/user.type';
import { UserService } from '@wqshared/services/user.service';

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
		generoPuesto: ['Cualquier género'],
		edad: [''],
		estadoCivil: [''],
		estudiosProfesion: ['--'],
		experiencia: ['Sin experiencia'],
		experienciaEn: ['--'],
		habilidades: ['--'],
		porcentajeIngles: [0,[
			Validators.max(100)
		]],
		disponibilidadViajar: [false],
		sueldoMinimo: [0],
		sueldoMaximo: [0],
		tipoContrato: ['', [Validators.required]],
		personaEntrevista: ['--'],
		comentarios: ['--']
	});

	matcher = new MyErrorStateMatcher();

	identity: Identity;

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
	get habilidades() {
		return this.requestForm.get('habilidades');
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


	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router
	) {
		this.identity = this.userService.getidentity();
		this.email = (this.identity && this.identity.person && this.identity.person.email) ? this.identity.person.email : '';
	}

	ngOnInit(): void {
		if(this.email === '') {
			Swal.fire({
				type: 'warning',
				html: 'Tu perfil no tiene cuenta de correo, por lo que no puedes generar solicitudes todavía'
			});
			this.router.navigate(['/services']);
		}
	}

	submit(): void {
		this.validateAllFormFields(this.requestForm);
		// console.log(this.requestForm);
		// console.log(this.identity);
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
					edad: +this.edad.value,
					estado_civil: this.estadoCivil.value,
					estudios_y_o_profesion: this.estudiosProfesion.value,
					anos_de_experiencia_2: this.experiencia.value,
					habilidades: this.habilidades.value,
					porcentaje_de_ingles: this.porcentajeIngles.value,
					disponibilidad_para_viajar: this.disponibilidadViajar.value,
					sueldo_minimo: this.sueldoMinimo.value,
					sueldo_maximo: this.sueldoMaximo.value,
					tipo_de_contrato: this.tipoContrato.value,
					quien_entrevistara_a_los_candidatos: this.personaEntrevista.value,
					comentarios: this.comentarios.value
				}
			};
			if(submitForm.custom_fields.anos_de_experiencia_2 !== 'Sin experiencia') {
				submitForm.custom_fields.experiencia_especifica_en = this.experienciaEn.value;
			}
			console.log(submitForm);
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
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los campos con error',
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
