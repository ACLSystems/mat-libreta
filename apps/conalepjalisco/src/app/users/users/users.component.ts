import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import Swal from 'sweetalert2';
import { SimpleGlobal } from 'ng2-simple-global';
import * as Secure from 'secure-random-password';

import { UserService } from '../services/users.service';
import { RequestService } from '../../requests/services/requests.service';

interface Display {
	value: string,
	viewValue: string
}

import {
	CommonService,
	DtOptions
} from '@mat-libreta/shared';

const TypeValues: Display[] = [
	{value: 'student', viewValue: 'Alumno'},
	{value: 'teacher', viewValue: 'Profesor'},
	{value: 'administrative', viewValue: 'Administrativo'}
];

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null,form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'mat-libreta-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

	loading: boolean = false;
	user: any = false;
	userGroups: any = false;
	newUser: boolean = false;
	allOUs: any[] = [];
	userForm = this.fb.group({
		name: ['',[
			Validators.required
		]],
		fatherName: ['',[
			Validators.required
		]],
		motherName: ['',[
			Validators.required
		]],
		email: ['', [
			Validators.required,
			Validators.email,
			Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
		]],
		campus: ['',[
			Validators.required
		]],
		password: [generatePassword(),[
			Validators.required
		]],
		type: ['student',[Validators.required]]
	});
	org: string;
	typeValues = TypeValues;
	tableHeaderGroup: string[];
	dtOptions = DtOptions;
	folios: boolean = false;

	get name() {
		return this.userForm.get('name');
	}
	get fatherName() {
		return this.userForm.get('fatherName');
	}
	get motherName() {
		return this.userForm.get('motherName');
	}
	get email() {
		return this.userForm.get('email');
	}
	get campus() {
		return this.userForm.get('campus');
	}
	get password() {
		return this.userForm.get('password');
	}
	get type() {
		return this.userForm.get('type');
	}

	constructor(
		private userService: UserService,
		private commonService: CommonService,
		private requestService: RequestService,
		private fb: FormBuilder,
		private sg: SimpleGlobal
	) {
		this.tableHeaderGroup = [
			'Tipo',
			'Grupo',
			'Curso',
			'Calificación',
			'Avance',
			'Inicio',
			'Fin',
			'Constancia'
		];
	}

	ngOnInit(): void {
		this.org = this.sg['environment'].orgName;
		this.commonService.displayLog('Org',this.org);
	}

	addUser() {
		this.getOUs();
		this.userForm.reset();
		this.user = false;
		this.folios = false;
	}

	getOUs() {
		Swal.fire('Espera...');
		Swal.showLoading();
		this.allOUs = [];
		this.requestService.getMyOU().subscribe(data => {
			const ou = data;
			if(ou.type === 'state') {
				this.requestService.getOUs(ou.name).subscribe(data => {
					this.allOUs = [...data];
					this.commonService.displayLog('All OUs', this.allOUs);
				}, error => {
					console.log(error);
				})
			} else {
				this.allOUs = [ou];
				this.commonService.displayLog('All OUs', this.allOUs);
			}
			Swal.hideLoading();
			Swal.close();
			this.newUser = true;
		}, error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				html: `No es posible extraer planteles: ${error}`
			})
		});
	}

	getUser() {
		this.user = false;
		this.newUser = false;
		this.folios = false;
		Swal.fire({
			title: 'Correo del usuario',
			text: 'Por favor, ingresa el correo del usuario',
			inputPlaceholder: 'Correo del usuario',
			input: 'email',
		}).then(email => {
			if(email.value) {
				Swal.fire({
					text: 'Espera...',
					allowOutsideClick: () => !Swal.isLoading()
				});
				Swal.showLoading();
				this.userService.getUser(email.value).subscribe(data => {

					if(data.message && data.message.includes('does not exist')) {
						Swal.fire({
							type: 'warning',
							text: 'Usuario ingresado no existe'
						});
						return;
					}
					this.user = data;
					this.commonService.displayLog('Usuario',this.user);
					this.userService.getUserGroups(email.value).subscribe(data => {
						Swal.hideLoading();
						Swal.close();
						if(data.message && typeof data.message === 'string' && data.message.includes('Usuario no existe')) {
							Swal.fire({
								type: 'warning',
								text: 'Usuario ingresado no existe'
							});
							return;
						}
						this.userGroups = [...data.message?.groups];
						this.commonService.displayLog('Grupos',this.userGroups);
					}, error => {
						Swal.hideLoading();
						Swal.close();
						console.log(error);
						Swal.fire({
							type: 'error',
							text: `Hubo un error: ${error.message}`
						})
					})
				}, error => {
					Swal.hideLoading();
					Swal.close();
					console.log(error);
					Swal.fire({
						type: 'error',
						text: `Hubo un error: ${error.message}`
					})
				})
			}
		})
	}

	generateUser() {
		this.validateAllFormFields(this.userForm);
		if(!this.userForm.valid) {
			Swal.fire({
				type: 'warning',
				text: 'Revisa los campos rqueridos o con error'
			});
			return;
		}
		this.email.setValue(this.email.value.toLowerCase());
		this.name.setValue(properCase(this.name.value));
		this.fatherName.setValue(properCase(this.fatherName.value));
		this.motherName.setValue(properCase(this.motherName.value));
		const sendUser = {
			name: this.email.value,
			org: this.org,
			orgUnit: this.campus.value,
			password: this.password.value,
			report: true,
			admin: {
				initialPassword: this.password.value,
				adminCreate: true
			},
			person: {
				name: this.name.value,
				fatherName: this.fatherName.value,
				motherName: this.motherName.value,
				email: this.email.value
			},
			corporate: {
				type: this.type.value
			},
			student: {
				isActive: true
			}
		};
		this.commonService.displayLog('UserToCreate',sendUser);
		Swal.fire('Espera...');
		Swal.showLoading();
		this.requestService.muir(sendUser).subscribe(data => {
			Swal.hideLoading();
			Swal.close();
			// console.log(data);
			if(data.message.includes('creado')){
				Swal.fire({
					type: 'success',
					html: `${data.message}`
				})
			} else {
				Swal.fire({
					type: 'warning',
					html: `${data.message}`
				})
			}
		},error => {
			console.log(error)
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				html: `Hubo un error: ${error}`
			})
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

function generatePassword() {
	return Secure.randomPassword({
		length: 12,
			characters: [{
				characters: Secure.upper,
				exactly: 4
			},{
				characters: Secure.symbols,
				exactly: 0
			},{
				characters: Secure.digits,
				exactly: 2
			},
			Secure.lower
			]
	});
}

function properCase(phrase:string) {
	const words = phrase.split(' ');
	const newWords = words.map(word => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	});
	return newWords.join(' ');
}
