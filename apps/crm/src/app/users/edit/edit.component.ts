import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER, TAB} from '@angular/cdk/keycodes';
import Swal from 'sweetalert2';

import { UserService } from '@crmshared/services/user.service';

import { Contact } from '@crmshared/types/contact.type';
import { Display } from '@crmshared/types/display.type';

import {
	TYPES,
	ROLES,
	SOURCES,
	STATES,
	HAPPINESS
} from '@crmshared/enums/contact.enum';

@Component({
  selector: 'mat-libreta-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditUserComponent implements OnInit {

	@ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
	@ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>

	loading	: boolean = false;
	userid	: string;
	user		: Contact;
	color: string = 'primary';

	visible 		= true;
	selectable 	= true;
	removable 	= true;
	addOnBlur 	= true;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];

	validEmailType		: boolean = true;
	userExists				: boolean = false;
	userExistsMessage	: string 	= '';

	// Enums
	readonly types			: Display[]=[...TYPES];
	readonly roles			: Display[]=[...ROLES];
	readonly sources		: Display[]=[...SOURCES];
	readonly states			: Display[]=[...STATES];
	readonly happiness	: Display[]=[...HAPPINESS];
	accounts	: Display[] = [{
		value: 'no',
		viewValue: 'Primero crear cuentas'
	}];
	owners		: Display[] = [{
		value: 'no',
		viewValue: 'Primero crear usuarios'
	}];


	// Compañía y correo
	account				= new FormControl('');
	email					= new FormControl('');

	// Nombre
	name					= new FormControl('');
	fatherName		= new FormControl('');
	motherName		= new FormControl('');
	birthDate 		= new FormControl('');

	// Teléfonos
	mainPhone			= new FormControl('');
	phone					= new FormControl('');
	cellPhone			= new FormControl('');

	// Detalles

	type					= new FormControl('');
	contactRole		= new FormControl('');
	hasAuthority	= new FormControl('');
	unSubscribe		= new FormControl('');
	owner					= new FormControl('');
	source				= new FormControl('');
	notes					= new FormControl('');
	userHappiness = new FormControl('');

	tags					= [];
	tagsCtrl 			= new FormControl('');
	suburbs 			= [];

	allTags: string[] = [];
	filteredTags: Observable<string[]>;

	// Redes Sociales

	facebook			= new FormControl('');
	twitter				= new FormControl('');
	linkedin			= new FormControl('');
	google				= new FormControl('');
	instagram			= new FormControl('');
	skype					= new FormControl('');

	// Dirección

	street				= new FormControl('');
	ext						= new FormControl('');
	int						= new FormControl('');
	suburb				= new FormControl('');
	postalCode		= new FormControl('');
	locality			= new FormControl('');
	city					= new FormControl('');
	state					= new FormControl('');
	country				= new FormControl('');

  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userService: UserService
		) {
			this.loading = true;
			this.activatedRoute.params.subscribe( params => {
				this.userid = params.user;
			});
			this.validEmailType = true;
			this.color='primary';
			this.filteredTags = this.tagsCtrl.valueChanges.pipe(
				startWith(null),
				map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice())
			);
		}

  ngOnInit() {
		this.loading = true;
		this.getUser();
  }

	getUser() {
		if(this.userid) {
			this.loading = true;
			this.userService.getUser(this.userid).subscribe(data => {
				this.user = data;
				this.displayLog('User',this.user);
				this.userService.orgList().subscribe(data => {
					if(data && Array.isArray(data) && data.length > 0) {
						this.accounts = [];
						data.forEach(eachAccount => {
							this.accounts.push({
								value: eachAccount._id,
								viewValue: eachAccount.name
							});
						});
						this.displayLog('Cuentas',this.accounts);
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
									this.populateData();
									this.loading = false;
								}, error => {
									console.log(error.message);
								});
							}
						}, error => {							console.log(error);
						});
					}
				}, error => {
					console.log(error);
				});
			}, error => {
				this.loading = false;
				Swal.fire({
					type: 'error',
					title: 'Hubo un error',
					text: error
				});
			});
		} else {

		}

	}

	getPostalCode(tempValue?:string) {
		Swal.fire('Por favor espera');
		Swal.showLoading();
		this.userService.getPostalCode(this.postalCode.value).subscribe(data => {
			if(data && Array.isArray(data.colonias) && data.colonias.length > 0) {
				this.locality.setValue(data.municipio);
				let foundState = this.states.find(({ viewValue }) => viewValue === data.estado);
				if(foundState) {
					this.state.setValue(foundState.value);
					this.suburbs = data.colonias.map((str:string) => ({ value: str, viewValue: str}));
					if(tempValue) {
						this.suburb.setValue(tempValue);
					} else {
						this.suburb.setValue(this.suburbs[0].value);
					}
				} else {
					let found = false;
					var i = 0;
					while(!found && i < this.states.length) {
						if(data.estado.includes(this.states[i].viewValue) || this.states[i].viewValue.includes(data.estado)) {
							this.state.setValue(this.states[i].value);
							this.suburbs = data.colonias.map((str:string) => ({ value: str, viewValue: str}));
							if(tempValue) {
								this.suburb.setValue(tempValue);
							} else {
								this.suburb.setValue(this.suburbs[0].value);
							}
							found = true;
						}
						i++;
					}
				}
				this.setField('address','state',null,'state');
				this.setField('address','postalCode',null,'postalCode');
				this.setField('address','locality',null,'locality');
				if(data.colonias.length > 0) {
					this.setField('address','suburb',null,'suburb');
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

	populateData() {
		// Poblar campo cuentas
		let accs = [];
		this.user.org.forEach(o => {
			accs.push(o._id);
		});
		this.account.setValue(accs);

		// Poblar email y person
		this.email.setValue(this.user.name);
		let personFields = Object.keys(this.user.person);
		personFields.forEach(f => {
			if(this[f]) {
				this[f].setValue(this.user.person[f]);
			}
		});


		// Poblar tipo
		if(this.user.type && Array.isArray(this.user.type) && this.user.type.length > 0) {
			this.type.setValue([...this.user.type]);
		}
		// Poblar contacto
		if(this.user.contactRole && Array.isArray(this.user.contactRole) && this.user.contactRole.length > 0) {
			this.contactRole.setValue([...this.user.contactRole]);
		}
		// Poblar fuente
		if(this.user.source) {
			this.source.setValue(this.user.source);
		}
 		// Poblar campo dueño
		this.owner.setValue(this.user.owner._id);
		// Poblar autoridad y Suscrito
		if(this.user.hasAuthority) {
			this.hasAuthority.setValue(true);
		} else {
			this.hasAuthority.setValue(false);
		}
		if(this.user.unSubscribe) {
			this.unSubscribe.setValue(true);
		} else {
			this.unSubscribe.setValue(false);
		}
		// Poblar tags
		this.user.tags.forEach(t => {
			t = t.toLowerCase();
		})
		this.tags = [...this.user.tags];

		// Poblar redes Sociales
		let socialFields = Object.keys(this.user.social);
		socialFields.forEach(f => {
			if(this[f]) {
				this[f].setValue(this.user.social[f]);
			}
		});

		if(this.user.happiness) {
			this.userHappiness.setValue(this.user.happiness);
		}

		// Poblar dirección
		if(this.user.address && Array.isArray(this.user.address) && this.user.address.length > 0) {
			let tempPC = this.user.address[0].suburb;
			let addressFields = Object.keys(this.user.address[0]);
			addressFields.forEach(f => {
				if(this[f]) {
					this[f].setValue(this.user.address[0][f]);
				}
			});
			this.getPostalCode(tempPC);
		}
	}

	cancel(){
		this.router.navigate(['/users/view']);
	}

	saveUser() {
		Swal.fire('Espera');
		Swal.showLoading();
		this.userService.modifyUser(this.user).subscribe(() => {
			Swal.close();
			Swal.hideLoading();
			Swal.fire({
				type: 'info',
				'title': 'Usuario modificado'
			});
		}, error => {
			Swal.close();
			Swal.hideLoading();
			Swal.fire({
				type: 'error',
				'title': 'Hubo un error',
				'text': `${error.message}`
			});
		});
	}

	setEmail() {
		this.setField('name','email');
		this.setField('person','email',null,'email');
	}

	setField(userField:string, localField: string, enums?: string, innerUserField?:string) {
		// let field = this[userField];
		// let value = (field instanceof FormControl) ? field.value : field;
		if(localField === 'account') {
			let tempArray = [];
			this[localField].value.forEach((val:string) => {
				const tempLocalField = this[enums].find((e:any) => e.value + '' === val + '');
				if(tempLocalField) {
					tempArray.push({
						_id: tempLocalField.value,
						name: tempLocalField.viewValue
					});
				}
			});
			this.user[userField] = [...tempArray];
			this.displayLog(userField,this.user[userField]);
		} else if(localField === 'type') {
			let tempArray = [];
			this[localField].value.forEach((val:string) => {
				const tempLocalField = this[enums].find((e:any) => e.value + '' === val + '');
				if(tempLocalField) {
					tempArray.push(tempLocalField.value);
				}
			});
			const testFieldF = tempArray.every(e => this.user[localField].includes(e));
			const testFieldB = this.user[localField].every(e => tempArray.includes(e));
			if(!testFieldF || !testFieldB) {
				this.user[userField] = [...tempArray];
				this.displayLog(userField,this.user[userField]);
			}
		} else if(innerUserField) {
			if(userField === 'address') {
				// Aquí hay que arreglar para poder adicionar más direcciones
				// incluyendo el nombre de la dirección que no existe todavía
				this.user[userField][0][innerUserField] = this[localField].value;
				this.displayLog(userField + '.' + innerUserField,this.user[userField][0][innerUserField]);
			} else {
				this.user[userField][innerUserField] = this[localField].value;
				this.displayLog(userField + '.' + innerUserField,this.user[userField][innerUserField]);
			}
		} else {
			this.user[userField] = this[localField].value;
			this.displayLog(userField,this.user[userField]);
		}
		this.displayLog('Hole User', this.user);
	}

	displayLog(display:string, obj: any) {
		console.group(display);
		console.log(obj);
		console.groupEnd();
	}

	// modificar tags
	add(event: MatChipInputEvent): void {
		if(!this.matAutocomplete.isOpen) {
			const input = event.input;
			const value = event.value;

			// Add a tag
			if ((value || '').trim()) {
				this.tags.push(value.trim().toLowerCase());
				this.user.tags = [...this.tags];
				this.displayLog('tags',this.user.tags);
				this.displayLog('Hole User', this.user);
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
			this.user.tags = [...this.tags];
			this.displayLog('tags',this.user.tags);
			this.displayLog('Hole User', this.user);
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
		this.user.tags = [...this.tags];
		this.displayLog('Etiquetas seleccionadas',this.tags);
  }

	emailValidationType(e:any){
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
					this.setEmail();
				}
			);
		}
	}

	private _filter(value:string): string[] {
		const filterValue = value.toLowerCase();
		return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
	}
}
