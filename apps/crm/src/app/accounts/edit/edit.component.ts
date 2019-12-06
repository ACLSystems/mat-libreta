import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
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
  selector: 'mat-libreta-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditAccountComponent implements OnInit {

	@ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
	@ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>

	loading		: boolean = false;
	accountid	: string;
	account		: Account;
	color: string = 'primary';

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

	name			= new FormControl('');
	longName	= new FormControl('');
	alias			= new FormControl('');
	type			= new FormControl('');
	owner			= new FormControl('');
	notes			= new FormControl('');
	accountHappiness = new FormControl('');

	// Teléfonos
	mainPhone			= new FormControl('');
	phone					= new FormControl('');
	emails				= [];

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
				this.accountid = params.user;
			});
			this.color='primary';
			this.filteredTags = this.tagsCtrl.valueChanges.pipe(
				startWith(null),
				map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice())
			);
		}

  ngOnInit() {
		this.loading = true;
		this.getAccount();
  }

	getAccount() {
		if(this.accountid) {
			this.loading = true;
			this.userService.getAccount(this.accountid).subscribe(data => {
				this.account = data;
				this.displayLog('Cuenta',this.account);
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
			}, error => {
				this.loading = false;
				Swal.fire({
					type: 'error',
					title: 'Hubo un error',
					text: error.error.message
				});
				this.router.navigate(['/accounts/view']);
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
				this.displayLog('localState',this.state.value);
				this.displayLog('AccountAddress',this.account.address);
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
			Swal.close();
			Swal.hideLoading();
			console.log(error);
		});
	}

	populateData() {

		// Poblar nombre y nombre largo
		if(this.account.name) {
			this.name.setValue(this.account.name);
		}
		if(this.account.longName) {
			this.longName.setValue(this.account.longName);
		}

		// Poblar teléfonos
		if(this.account.phone) {
			this.mainPhone.setValue(this.account.phone[0]);
			this.phone.setValue(this.account.phone[1]);
		}

		// Poblar emails
		if(this.account.emails && this.account.emails.length > 0) {
			this.emails = this.account.emails;
		}

		// Poblar tipo
		if(this.account.type && Array.isArray(this.account.type) && this.account.type.length > 0) {
			this.type.setValue([...this.account.type]);
		}
 		// Poblar campo dueño
		if(this.account.owner) {
			this.owner.setValue(this.account.owner._id);
		}

		// Poblar tags
		this.account.tags.forEach(t => {
			t = t.toLowerCase();
		})
		this.tags = [...this.account.tags];

		// Poblar redes Sociales
		let socialFields = Object.keys(this.account.social);
		socialFields.forEach(f => {
			if(this[f]) {
				this[f].setValue(this.account.social[f]);
			}
		});

		if(this.account.happiness) {
			this.accountHappiness.setValue(this.account.happiness);
		}

		// Poblar dirección
		if(this.account.address && Array.isArray(this.account.address) && this.account.address.length > 0) {
			let tempPC = this.account.address[0].suburb;
			let addressFields = Object.keys(this.account.address[0]);
			addressFields.forEach(f => {
				if(this[f]) {
					this[f].setValue(this.account.address[0][f]);
				}
			});
			this.getPostalCode(tempPC);
		}
	}

	cancel(){
		this.router.navigate(['/accounts/view']);
	}

	saveAccount() {
		Swal.fire('Espera');
		Swal.showLoading();
		this.displayLog('Antes de enviar',this.account);
		this.userService.modifyAccount(this.account).subscribe(() => {
			Swal.close();
			Swal.hideLoading();
			Swal.fire({
				type: 'info',
				'title': 'Cuenta modificada'
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
		if(!this.account[userField] || (Array.isArray(this.account[userField]) && this.account[userField].length === 0)) {
			if(userField === 'owner') {
				this.account.owner = {
					_id: '',
					person: {
						name: '',
						fatherName: '',
						motherName: '',
						email: ''
					}
				}
			}
			console.log('SI ENTRE A CORREGIR')
			if(userField === 'address') {
				this.account[userField].push({
					city: '',
					country: '',
					ext: '',
					int: '',
					locality: '',
					postalCode: '',
					state: '',
					street: '',
					suburb: ''
				})
			}
		}
		if(localField === 'type') {
			let tempArray = [];
			this[localField].value.forEach((val:string) => {
				const tempLocalField = this[enums].find((e:any) => e.value + '' === val + '');
				if(tempLocalField) {
					tempArray.push(tempLocalField.value);
				}
			});
			const testFieldF = tempArray.every(e => this.account[localField].includes(e));
			const testFieldB = this.account[localField].every(e => tempArray.includes(e));
			if(!testFieldF || !testFieldB) {
				this.account[userField] = [...tempArray];
				this.displayLog(userField,this.account[userField]);
			}
		} else if(innerUserField) {
			if(userField === 'address') {
				// Aquí hay que arreglar para poder adicionar más direcciones
				// incluyendo el nombre de la dirección que no existe todavía
				this.account[userField][0][innerUserField] = this[localField].value;
				this.displayLog(userField + '.' + innerUserField,this.account[userField][0][innerUserField]);
			} else {
				this.account[userField][innerUserField] = this[localField].value;
				this.displayLog(userField + '.' + innerUserField,this.account[userField][innerUserField]);
			}
		} else {
			this.account[userField] = this[localField].value;
			this.displayLog(userField,this.account[userField]);
		}
		this.displayLog('Toda la cuenta', this.account);
	}

	displayLog(display:string, obj: any) {
		console.group(display);
		console.log(obj);
		console.groupEnd();
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
					this.account.tags = [...this.tags];
				} else {
					Swal.fire({
						type: 'info',
						title: `Etiqueta "${value}" ya se agregó`
					});
				}
				this.displayLog('Etiquetas',this.tags);
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
			this.account.tags = [...this.tags];
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
		this.account.tags = [...this.tags];
		this.displayLog('Etiquetas seleccionadas',this.tags);
  }

	private _filter(value:string): string[] {
		const filterValue = value.toLowerCase();
		return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
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
					this.account.emails = [...this.emails];
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
			this.account.emails = [...this.emails];
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

}
