import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {ErrorStateMatcher} from '@angular/material/core';
import Swal from 'sweetalert2';
import { UserService } from '@crmshared/services/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'mat-libreta-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss'],
	providers: [
		UserService
	]
})
export class CreateUserComponent implements OnInit {

	// Compañía y correo
	account				= new FormControl('');
	email					= new FormControl('');

	// Nombre
	name					= new FormControl('');
	fatherName		= new FormControl('');
	motherName		= new FormControl('');

	// Teléfonos
	mainPhone			= new FormControl('');
	phone					= new FormControl('');
	celPhone			= new FormControl('');

	// Detalles

	type					= new FormControl('');
	contactRole		= new FormControl('');
	hasAuthority	= new FormControl('');
	unSubscribed	= new FormControl('');
	owner					= new FormControl('');
	source				= new FormControl('');
	notes					= new FormControl('');
	_enabled: boolean;
	_minRows: number;
	_maxRows: number;

	tags					= [];

	types = [
		{value: 'lead', viewValue: 'Prospecto'},
		{value: 'contact', viewValue: 'Contact'},
		{value: 'internal', viewValue: 'Interno'},
		{value: 'partner', viewValue: 'Alianza'},
		{value: 'reseller', viewValue: 'Broker'},
		{value: 'other', viewValue: 'Otro'}
	];

	roles = [
		{value: 'Decision Maker', viewValue: 'Tomador de decisiones'},
		{value: 'Executive Sponsor', viewValue: 'Promotor Ejecutivo'},
		{value: 'Admin/Project Manager', viewValue: 'Líder/Administrador de proyecto'},
		{value: 'Finance', viewValue: 'Finanzas'},
		{value: 'Legal', viewValue: 'Legal'},
		{value: 'Purchase', viewValue: 'Compras'},
		{value: 'Technical', viewValue: 'Técnico'},
		{value: 'other', viewValue: 'Otro'}
	];

	sources = [
		{value: 'web', viewValue: 'Web'},
		{value: 'phone', viewValue: 'Teléfono'},
		{value: 'email', viewValue: 'Email'},
		{value: 'fresh', viewValue: 'Freshworks'},
		{value: 'direct', viewValue: 'Directo'},
		{value: 'refereral', viewValue: 'Referido'},
		{value: 'social', viewValue: 'Redes Sociales'},
		{value: 'other', viewValue: 'Otro'}
	];

	owners = [
		{value: 'luis', viewValue: 'Luis'},
		{value: 'arturo', viewValue: 'Arturo'},
		{value: 'stranger', viewValue: 'Stranger'}
	];

	states = [
		{value: 'AS', viewValue: 'Aguascalientes'},
		{value: 'BC', viewValue: 'Baja California'},
		{value: 'BS', viewValue: 'Baja California Sur'},
		{value: 'CC', viewValue: 'Campeche'},
		{value: 'CS', viewValue: 'Chiapas'},
		{value: 'CH', viewValue: 'Chihuahua'},
		{value: 'DF', viewValue: 'Ciudad de México'},
		{value: 'CL', viewValue: 'Coahuila'},
		{value: 'CM', viewValue: 'Colima'},
		{value: 'DG', viewValue: 'Durango'},
		{value: 'GT', viewValue: 'Guanajuato'},
		{value: 'GR', viewValue: 'Guerrero'},
		{value: 'HG', viewValue: 'Hidalgo'},
		{value: 'JC', viewValue: 'Jalisco'},
		{value: 'MX', viewValue: 'México'},
		{value: 'MN', viewValue: 'Michoacán'},
		{value: 'MS', viewValue: 'Morelos'},
		{value: 'NT', viewValue: 'Nayarit'},
		{value: 'NL', viewValue: 'Nuevo León'},
		{value: 'OC', viewValue: 'Oaxaca'},
		{value: 'PL', viewValue: 'Puebla'},
		{value: 'QO', viewValue: 'Querétaro'},
		{value: 'QR', viewValue: 'Quintana Roo'},
		{value: 'SP', viewValue: 'San Luis Potosí'},
		{value: 'SL', viewValue: 'Sinaloa'},
		{value: 'SR', viewValue: 'Sonora'},
		{value: 'TC', viewValue: 'Tabasco'},
		{value: 'TS', viewValue: 'Tamaulipas'},
		{value: 'TL', viewValue: 'Tlaxcala'},
		{value: 'VZ', viewValue: 'Veracruz'},
		{value: 'YN', viewValue: 'Yucatán'},
		{value: 'ZS', viewValue: 'Zacatecas'}
	]

	// Redes Sociales

	facebook			= new FormControl('');
	twitter				= new FormControl('');
	linkedin			= new FormControl('');
	google				= new FormControl('');
	instagram			= new FormControl('');
	skype					= new FormControl('');

	// Dirección

	street				= new FormControl('');
	extNum				= new FormControl('');
	intNum				= new FormControl('');
	suburb				= new FormControl('');
	postalCode		= new FormControl('');
	locality			= new FormControl('');
	city					= new FormControl('');
	state					= new FormControl('');
	country				= new FormControl('');

	suburbs = [];

	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];

	validEmailType: boolean = false;
	userExists: boolean = false;
	userExistsMessage: string = '';

	matcher = new MyErrorStateMatcher();

	constructor(private userService: UserService) {
		// setear los defaults
		this.type.setValue([this.types[0].value]);
		this.source.setValue(this.sources[0].value);
		this.contactRole.setValue([this.roles[0].value]);
		this.owner.setValue(this.owners[0].value);
		this.state.setValue(this.states[0].value);
		this.country.setValue('México');
	}

	ngOnInit() {
	}

	emailValidationType(e){
		this.userExists = false;
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(String(e).toLowerCase())) {
				this.validEmailType = true;
		} else {
			this.validEmailType = false;
		}
	}

	checkUserExistence() {
		Swal.fire('Espera...');
		Swal.showLoading();
		if(this.validEmailType) {
			this.userService.checkUserExistence(this.email.value).subscribe(data => {
					console.log(data.message);
					this.userExists = true;
					this.userExistsMessage = data.message;
					Swal.close();
					Swal.hideLoading();
					Swal.fire({
						title: this.userExistsMessage,
						type: 'error'
					});
					this.email.setValue('');
				},
				error =>
				{
					console.log(error.message);
					this.userExists = false;
					this.userExistsMessage = error.message;
					Swal.close();
					Swal.hideLoading();
				}
			);
		}
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add a tag
		if ((value || '').trim()) {
			this.tags.push(value.trim());
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	remove(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}
	}

	getPostalCode() {
		Swal.fire('Por favor espera');
		Swal.showLoading();
		this.userService.getPostalCode(this.postalCode.value).subscribe(data => {
			console.log(data);
			if(data && Array.isArray(data.colonias) && data.colonias.length > 0) {
				this.locality.setValue(data.municipio);
				let foundState = this.states.find(({ viewValue }) => viewValue === data.estado);
				if(foundState) {
					this.state.setValue(foundState.value);
					this.suburbs = data.colonias.map((str:string) => ({ value: str, viewValue: str}));
					this.suburb.setValue(this.suburbs[0].value);
				} else {
					let found = false;
					var i = 0;
					while(!found && i < this.states.length) {
						if(data.estado.includes(this.states[i].viewValue) || this.states[i].viewValue.includes(data.estado)) {
							this.state.setValue(this.states[i].value);
							this.suburbs = data.colonias.map((str:string) => ({ value: str, viewValue: str}));
							this.suburb.setValue(this.suburbs[0].value);
							found = true;
						}
						i++;
					}
				}
				Swal.close();
				Swal.hideLoading();
			} else  {
				this.suburbs = [];
				this.suburb.setValue(null);
				this.locality.setValue('');
				this.state.setValue(null);
				Swal.fire({
					type: 'info',
					title: `Código postal ${this.postalCode.value} no encontrado`
				});
			}
		}, error => {
			console.log(error);
		});
	}

	saveUser() {
		const identity = JSON.parse(localStorage.getItem('identity'));
		const newUserProfile = {
			org: this.account.value,
			name: this.email.value,
			person: {
				email: this.email.value,
				name: this.name.value,
				fatherName: this.fatherName.value,
				motherName: this.motherName.value
			},
			type: this.type.value,
			contactRole: this.contactRole.value,
			hasAuthority: this.hasAuthority.value ? true: false,
			unSubscribe: this.unSubscribed.value ? true: false,
			owner: this.owner.value || identity.userid,
			source: this.source.value,
			tags: this.tags,
			social: {
				facebook: this.facebook.value,
				twitter: this.twitter.value,
				linkedin: this.linkedin.value,
				google: this.google.value,
				instagram: this.instagram.value,
				skype: this.skype.value
			},
			address: [{
				street: this.street.value,
				ext: this.extNum.value,
				int: this.intNum.value,
				suburb: this.suburb.value,
				postalCode: this.postalCode.value,
				locality: this.locality.value,
				city: this.city.value,
				state: this.state.value,
				country: this.country.value
			}]
		};

		console.log(newUserProfile);
		Swal.fire('Por favor espera');
		Swal.showLoading();
		this.userService.createUser(newUserProfile).subscribe(data => {
			console.log(data);
			if(this.notes) {
				const note = {
					text: this.notes.value,
					id: data.id
				};
				this.userService.createUserNote(note).subscribe(() => {
					Swal.close();
					Swal.hideLoading();
					Swal.fire({
						type: 'info',
						title: 'Usuario generado'
					});
				}, error => {
					console.log(error);
				})
			} else {
				Swal.close();
				Swal.hideLoading();
				Swal.fire({
					type: 'info',
					title: 'Usuario generado'
				});
			}
		}, error => {
			console.log(error);
		});
	}


}
