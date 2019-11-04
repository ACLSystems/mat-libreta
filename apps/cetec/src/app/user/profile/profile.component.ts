import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import Swal from 'sweetalert2';

import { Identity } from '@cetecshared/types/user.type';
import { UserService } from '@cetecshared/services/user.service';

declare const $: any;

@Component({
	selector: 'mat-libreta-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	identity: Identity;
	loading: boolean;
	image: any;
	details: any;
	changeBirthDate: boolean;
	ChangeCelPhone: boolean;
	today: Date;
	code: string;
	name: string;
	fatherName: string;
	motherName: string;
	mainError: boolean;

	constructor(
		private userService: UserService
	) {
		this.loading = true;
		this.mainError = false;
		this.changeBirthDate = false;
		this.ChangeCelPhone = false;
		this.today = new Date();
	}

	ngOnInit() {
		this.loading = true;
		this.mainError = false;
		this.identity = this.userService.getidentity();
		// console.log(this.user);
		this.image = this.userService.getUserImage().subscribe(data => {
			this.createImageFromBlob(data);
		}, err => {
			console.log(err);
		});
		this.details = this.userService.getUser(this.identity.name).subscribe(data => {
			this.details = data;
			console.log(this.details);
			this.loading = false;
			if(!this.details.admin.isDataVerified) {
				this.name = this.details.person.name;
				this.fatherName = this.details.person.fatherName;
				this.motherName = this.details.person.motherName;
			}
		}, err => {
			let message = err.error.message || err.statusText;
			Swal.fire({
				type: 'error',
				html: `Hubo un error: ${message}<br>Intenta en unos minutos`
			});
			this.mainError = true;
			console.log(err);
		});
	}

	createImageFromBlob(image: Blob) {
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			this.image = reader.result;
		}, false);
		if (image) {
			reader.readAsDataURL(image);
		}
	}

	getHelpOnDataVerified() {
		Swal.fire({
			title: 'Datos no verificados',
			type: 'info',
			html: 'Los datos registrados no han sido validados por ti.<br>Escribe correctamente tu nombre y apellidos si no lo están para validar.<br>Recuerda que tu nombre y apellidos deben estar correctos, ya que al finalizar tus cursos se te entrega constancia<br>Nota: Si tus nombres y apellidos están correctos solo presiona "Verificar datos"'
		});
	}

	doChangeBirthDate() {
		this.changeBirthDate = true;
	}

	doChangeCelPhone() {
		this.ChangeCelPhone = true;
	}

	setBirthDate(type:string, event: MatDatepickerInputEvent<Date>) {
		const date = new Date(event.value);
		this.details.person.birthDate = date;
	}

	onBlurBDate() {
		this.changeBirthDate = false;
	}

	setCelPhone(event: any) {
		this.details.person.celPhone = event;
	}

	onBlurCelPhone() {
		this.ChangeCelPhone = false;
	}

	validateEmail() {
		this.userService.validateEmailWOPR().subscribe(data => {
			if(data && data.message && data.message === 'Email found') {
				Swal.fire({
					type: 'info',
					title: 'Validación de correo electrónico',
					html: 'En los siguientes minutos recibirás un correo electrónico con una clave de validación. <br>Sigue las instrucciones en el correo.'
				});
				this.loading = true;
				this.details = this.userService.getUser(this.identity.name).subscribe(data => {
					this.details = data;
					console.log(this.details);
					this.loading = false;
				}, err => {
					console.log(err);
				});
			} else {
				Swal.fire({
					type: 'error',
					html: 'Hubo un error en la comunicación.<br>Espera unos minutos y vuelve a intentarlo.'
				});
				console.log(data);
			}
		}, error => {
			Swal.fire({
				type: 'error',
				html: 'Hubo un error en la comunicación.<br>Espera unos minutos y vuelve a intentarlo.'
			});
			console.log(error);
		});
	}

	validateEmailCode(event:any) {
		if (event && (event.key === "Enter" || event.type === 'click')) {
	    if(this.code === this.details.admin.recoverString) {
				this.userService.confirmEmail(this.code).subscribe(data => {
					if(data && data.message && data.message === 'Validación de correo exitoso') {
						Swal.fire({
							type: 'info',
							text: 'Clave correcta'
						});
						this.loading = true;
						this.identity.admin.isVerified = true;
						this.identity.admin.recoverString = '';
						this.identity = this.userService.updateIdentity(this.identity);
						this.details = this.userService.getUser(this.identity.name).subscribe(data => {
							this.details = data;
							console.log(this.details);
							this.loading = false;
						}, err => {
							console.log(err);
						});
					}
				}, error => {
					Swal.fire({
						type: 'error',
						html: 'Hubo un error al intentar validar el código: <br>' +
						error.message
					});
					console.log(error);
				});

			} else {
				Swal.fire({
					type: 'error',
					text: 'Clave incorrecta'
				});
			}
		}
	}

	updateUserMainData() {
		Swal.fire({
			title: 'Se actualizará tu nombre',
			html: `Tu nombre será actualizado a:<br> <h3 text-center>${this.name} ${this.fatherName} ${this.motherName}</h3><br>Si tus datos están correctos, presiona "Proceder".<br>Si no, presiona cancelar y corrige`,
			type: 'warning',
			showCancelButton: true,
			cancelButtonColor: 'red',
			confirmButtonText: 'Proceder',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if(result.value) {
				this.loading = true;
				this.identity.person.name = this.name;
				this.identity.person.fatherName = this.fatherName;
				this.identity.person.motherName = this.motherName;
				this.identity.admin.isDataVerified = true;
				this.userService.validateUserMainData(this.identity).subscribe(data => {
					if(data && data.message && data.message === `Usuario ${this.identity.name} actualizado`) {
						this.identity = this.userService.updateIdentity(this.identity);
						this.details = this.userService.getUser(this.identity.name).subscribe(data => {
							this.details = data;
							console.log(this.details);
							this.loading = false;
							if(!this.details.admin.isDataVerified) {
								this.name = this.details.person.name;
								this.fatherName = this.details.person.fatherName;
								this.motherName = this.details.person.motherName;
							}
						}, err => {
							console.log(err);
						});
						this.loading = false;
						this.showNotification('top','right','Tus datos se han actualizado');
					} else {
						Swal.fire({
							type: 'error',
							html: `Hubo un error: ${data.message}`
						});
						this.name = this.identity.person.name;
						this.fatherName = this.identity.person.fatherName;
						this.motherName = this.identity.person.motherName;
						this.loading = false;
					}
				}, error =>{
					Swal.fire({
						type: 'error',
						html: `Hubo un error: ${error.error.message}`
					});
					console.log(error)
					this.name = this.identity.person.name;
					this.fatherName = this.identity.person.fatherName;
					this.motherName = this.identity.person.motherName;
					this.loading = false;
				});
			}
		});
	}

	showNotification(from: string, align: string, message: string) {
			// const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
			//
			// const color = Math.floor((Math.random() * 6) + 1);

			$.notify({
					icon: 'notifications',
					message: message
			}, {
					type: 'primary',
					timer: 3000,
					placement: {
							from: from,
							align: align
					},
					template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
						'<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
						'<i class="material-icons" data-notify="icon">notifications</i> ' +
						'<span data-notify="title">{1}</span> ' +
						'<span data-notify="message">{2}</span>' +
						'<div class="progress" data-notify="progressbar">' +
							'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
						'</div>' +
						'<a href="{3}" target="{4}" data-notify="url"></a>' +
					'</div>'
			});
	}

	// onKeydown(event) {
	//   if (event.key === "Enter") {
	//     console.log(event);
	//   }
	// }

}
