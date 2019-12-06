import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { UserService } from '@crmshared/services/user.service';

import { Account } from '@crmshared/types/account.type';
import { Display } from '@crmshared/types/display.type';

import {
	TYPES,
	ROLES,
	SOURCES,
	STATES,
	HAPPINESS
} from '@crmshared/enums/account.enum';

@Component({
  selector: 'mat-libreta-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateAccountComponent implements OnInit {

	@ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
	@ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>

	loading		: boolean = false;
	color: string = 'primary';

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

	suburbs = [];

	tags					= [];
	tagsCtrl 			= new FormControl('');
	allTags: string[] = [];
	filteredTags: Observable<string[]>;

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

	// Enums
	readonly types			: Display[]=[...TYPES];
	readonly roles			: Display[]=[...ROLES];
	readonly sources		: Display[]=[...SOURCES];
	readonly states			: Display[]=[...STATES];
	readonly happiness	: Display[]=[...HAPPINESS];

	owners		: Display[] = [{
		value: 'no',
		viewValue: 'Primero crear usuarios'
	}];

	@ViewChild("long", {static: false}) longNameField: ElementRef;
	focusLongName(): void {
		this.longNameField.nativeElement.focus();
	}

  constructor(
		private userService: UserService,
		private router: Router
	) {
		this.type.setValue([this.types[0].value]);
		this.owner.setValue(this.owners[0].value);
		this.state.setValue(this.states[0].value);
		this.country.setValue('México');
		this.color='primary';
		this.filteredTags = this.tagsCtrl.valueChanges.pipe(
			startWith(null),
			map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice())
		);
	}

  ngOnInit() {
		this.loading = true;
		this.getData();
  }

	getData() {
		this.userService.ownerList().subscribe(data => {
			if(data && Array.isArray(data) && data.length > 0) {
				this.owners = [];
				data.forEach(eachOwner => {
					this.owners.push({
						value: eachOwner._id,
						viewValue: `${eachOwner.person.name.split(' ')[0]} ${eachOwner.person.fatherName}`
					});
				});
				this.displayLog('Vendedores',this.owners);
				this.userService.getTags().subscribe(data => {
					this.allTags = data;
					this.displayLog('allTags', this.allTags);
					this.loading = false;
				}, error => {
					console.log(error.message);
				});
			}
		}, error => {							console.log(error);
		});
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
		if(!this.matAutocomplete.isOpen) {
			const input = event.input;
			const value = event.value;

			// Add a tag
			if ((value || '').trim()) {
				let findTag = this.tags.find(tag => tag === value);
				if(!findTag) {
					this.tags.push(value.trim().toLowerCase());
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

			this.tagsCtrl.setValue(null);
		}
	}

	removeTag(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}
	}

	selectedTag(event: MatAutocompleteSelectedEvent): void {
		console.log(event.option.viewValue)
		let findTag = this.tags.find(tag => tag === event.option.viewValue);
		if(findTag) {
			Swal.fire({
				type: 'info',
				title: `Etiqueta "${event.option.viewValue}" ya se agregó`
			});
			this.tagsCtrl.setValue(null);
			this.tagInput.nativeElement.value='';
			return;
		}
    this.tags.push(event.option.value);
		this.tagInput.nativeElement.value='';
		this.tagsCtrl.setValue(null);
		this.displayLog('Etiquetas seleccionadas',this.tags);
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
			tags: [...this.tags],
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
			this.router.navigate(['/accounts/view']);
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

	cancel(){
		this.router.navigate(['/accounts/view']);
	}

	displayLog(display:string, obj: any) {
		console.group(display);
		console.log(obj);
		console.groupEnd();
	}

	private _filter(value:string): string[] {
		const filterValue = value.toLowerCase();
		return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
	}



}
