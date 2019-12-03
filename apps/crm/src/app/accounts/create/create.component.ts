import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import Swal from 'sweetalert2';
import { UserService } from '@crmshared/services/user.service';

@Component({
  selector: 'mat-libreta-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateAccountComponent implements OnInit {

	name			= new FormControl('');
	longName	= new FormControl('');
	alias			= new FormControl('');
	type			= new FormControl('');
	owner			= new FormControl('');
	notes			= new FormControl('');

	// Teléfonos e email
	mainPhone			= new FormControl('');
	phone					= new FormControl('');
	emails				= [];

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

	tags					= [];
	visible = true;
	selectableTag = true;
	removableTag = true;
	addTagOnBlur = true;

	selectableEmail= true;
	removableEmail = true;
	addEmailOnBlur = true;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];

	orgExists: boolean = false;
	orgExistsMessage: string = '';

	types = [
		{value: 'customer', viewValue: 'Cliente'},
		{value: 'provider', viewValue: 'Proveedor'},
		{value: 'internal', viewValue: 'Interno'},
		{value: 'partner', viewValue: 'Alianza'},
		{value: 'support', viewValue: 'Soporte'}
	];

	owners = [
		{value: 'luis', viewValue: 'Luis'},
		{value: 'arturo', viewValue: 'Arturo'},
		{value: 'stranger', viewValue: 'Stranger'}
	];

	suburbs = [];

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

	@ViewChild("long", {static: false}) longNameField: ElementRef;
	focusLongName(): void {
		this.longNameField.nativeElement.focus();
	}

  constructor(
		private userService: UserService
	) {
		this.type.setValue([this.types[0].value]);
		this.owner.setValue(this.owners[0].value);
		this.state.setValue(this.states[0].value);
		this.country.setValue('México');
	}

  ngOnInit() {
  }

	checkOrgExistence() {
		Swal.fire('Espera...');
		Swal.showLoading();
		this.userService.checkOrgExistence(this.name.value).subscribe(data => {
				console.log(data.message);
				this.orgExists = true;
				this.orgExistsMessage = data.message;
				Swal.close();
				Swal.hideLoading();
				Swal.fire({
					title: this.orgExistsMessage,
					type: 'error'
				});
				this.name.setValue('');
			},
			error =>
			{
				console.log(error.message);
				this.orgExists = false;
				this.orgExistsMessage = error.message;
				Swal.close();
				Swal.hideLoading();
				this.focusLongName();
			}
		);
	}

	addTag(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add a tag
		if ((value || '').trim()) {
			let findTag = this.tags.find(tag => tag === value);
			if(!findTag) {
				this.tags.push(value.trim());
			} else {
				Swal.fire({
					type: 'info',
					title: `Etiqueta "${value}" ya se agregó`
				});
			}

		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	removeTag(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}
	}

	addEmail(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add a tag
		if ((value || '').trim()) {
			let findEmail = this.emails.find(email => email === value);
			if(!findEmail) {
				if(this.emailValidationType(value)) {
					this.emails.push(value.trim());
				} else {
					Swal.fire({
						type: 'error',
						title: `"${value}" no es una cuenta de correo válida`,
						text: 'Favor de revisar y corregir'
					});
				}
			} else {
				Swal.fire({
					type: 'info',
					title: `Etiqueta "${value}" ya se agregó`
				});
			}
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	removeEmail(email: string): void {
		const index = this.emails.indexOf(email);

		if (index >= 0) {
			this.emails.splice(index, 1);
		}
	}

	emailValidationType(e){
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(String(e).toLowerCase())) {
			return true;
		} else {
			return false;
		}
	}

	getPostalCode() {
		Swal.fire('Por favor espera');
		Swal.showLoading();
		console.log(this.postalCode.value);
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
				Swal.close();
				Swal.hideLoading();
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

	saveAccount() {
		const identity = JSON.parse(localStorage.getItem('identity'));
		console.log(this.emails)
		var newAccount = {
			longName: this.longName.value,
			name: this.name.value,
			type: this.type.value,
			owner: this.owner.value || identity.userid,
			tags: this.tags,
			phone: [],
			emails: (this.emails.length > 0) ? this.emails : [],
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
		if(this.mainPhone.value) {
			newAccount.phone.push(this.mainPhone.value);
		}
		if(this.phone.value) {
			newAccount.phone.push(this.phone.value);
		}

		console.log(newAccount);
		Swal.fire('Por favor espera');
		Swal.showLoading();
		this.userService.createAccount(newAccount).subscribe(data => {
			console.log(data);
			if(this.notes) {
				const note = {
					text: this.notes.value,
					id: data.id
				};
				this.userService.createOrgNote(note).subscribe(() => {
					Swal.close();
					Swal.hideLoading();
					Swal.fire({
						type: 'info',
						title: 'Cuenta generada'
					});
				}, error => {
					console.log(error);
				})
			} else {
				Swal.close();
				Swal.hideLoading();
				Swal.fire({
					type: 'info',
					title: 'Cuenta generada'
				});
			}
		}, error => {
			Swal.close();
			Swal.hideLoading();
			Swal.fire({
				type: 'error',
				title: `Hubo un error`
			});
			console.log(error);
		});
	}

}
