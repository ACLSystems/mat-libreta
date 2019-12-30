import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import { Router } from  '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ErrorStateMatcher } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { UserService } from '@crmshared/services/user.service';
import { CommonService } from '@crmshared/services/common.service';

import { Display } from '@crmshared/types/display.type';

import {
	TYPES,
	ROLES,
	SOURCES,
	STATES,
	HAPPINESS
} from '@crmshared/enums/account.enum';

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

	@ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
	@ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>

	loading: boolean = false;
	color: string = 'primary';

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
	cellPhone			= new FormControl('');

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
	tagsCtrl 			= new FormControl('');
	allTags: string[] = [];
	filteredTags: Observable<string[]>;

	// Enums
	readonly types			: Display[]=[...TYPES];
	readonly roles			: Display[]=[...ROLES];
	readonly sources		: Display[]=[...SOURCES];
	readonly states			: Display[]=[...STATES];
	readonly happiness	: Display[]=[...HAPPINESS];

	accounts: Display[] = [
		{value: 'no', viewValue: 'Primero crear cuentas'}
	];

	owners: Display[] = [
		{value: 'no', viewValue: 'Primero crear usuarios'}
	];

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

	constructor(
		private userService: UserService,
		private commonService: CommonService,
		private router: Router
	) {
		// setear los defaults
		this.loading = true;
		this.type.setValue([this.types[0].value]);
		this.source.setValue(this.sources[0].value);
		this.contactRole.setValue([this.roles[0].value]);
		// this.owner.setValue(this.owners[0].value);
		this.state.setValue(this.states[0].value);
		this.country.setValue('México');
		this.filteredTags = this.tagsCtrl.valueChanges.pipe(
			startWith(null),
			map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice())
		);
	}

	ngOnInit() {
		this.loading = true;

		this.populateData();
	}

	displayLog(display:string, obj: any) {
		console.group(display);
		console.log(obj);
		console.groupEnd();
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
		if(!this.matAutocomplete.isOpen) {
			const input = event.input;
			const value = event.value;

			// Add a tag
			if ((value || '').trim()) {
				this.tags.push(value.trim().toLowerCase());
			}

			// Reset the input value
			if (input) {
				input.value = '';
			}
			this.tagsCtrl.setValue(null);
		}
	}

	remove(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
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
		this.commonService.displayLog('Etiquetas seleccionadas',this.tags);
  }

	getPostalCode() {
		Swal.fire('Por favor espera');
		Swal.showLoading();
		this.userService.getPostalCode(this.postalCode.value).subscribe(data => {
			if(data && Array.isArray(data.colonias) && data.colonias.length > 0) {
				this.locality.setValue(data.municipio);
				if(data.ciudad) {
					this.city.setValue(data.ciudad);
				}
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
				motherName: this.motherName.value,
				mainPhone: this.mainPhone.value,
				secondaryPhone: this.phone.value,
				cellPhone: this.cellPhone.value
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
			if(this.notes.value) {
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
				});
			} else {
				Swal.close();
				Swal.hideLoading();
				Swal.fire({
					type: 'info',
					title: 'Usuario generado'
				});
			}
			this.router.navigate(['/users/view']);
		}, error => {
			console.log(error);
			Swal.hideLoading();
			Swal.fire({
				type: 'error',
				title: 'Hubo un error',
				text: error
			});
		});
	}

	cancel(){
		this.router.navigate(['/users/view']);
	}

	populateData() {
		this.userService.orgList().subscribe(data => {
			if(data && Array.isArray(data) && data.length > 0) {
				console.log(data)
				this.accounts = [];
				data.forEach(eachAccount => {
					this.accounts.push({
						value: eachAccount._id,
						viewValue: eachAccount.name
					});
				});
				this.userService.ownerList().subscribe(data => {
					if(data && Array.isArray(data) && data.length > 0) {
						this.owners = [];
						data.forEach(eachOwner => {
							this.owners.push({
								value: eachOwner._id,
								viewValue: `${eachOwner.person.name.split(' ')[0]} ${eachOwner.person.fatherName}`
							});
						});
						this.userService.getTags().subscribe(data => {
							this.allTags = data;
							this.commonService.displayLog('allTags', this.allTags);
							this.loading = false;
						}, error => {
							console.log(error.message);
							this.loading = false;
						});
						// console.log(this.accounts);
						// console.log(this.owners);
					}
				}, error => {
					console.log(error);
					this.loading = false;
				});
			}
		}, error => {
			console.log(error);
			this.loading = false;
		});
	}

	private _filter(value:string): string[] {
		const filterValue = value.toLowerCase();
		return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
	}

}
