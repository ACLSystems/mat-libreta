import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { HTTPService } from '@mat-libreta/shared';

const statuses = [
	'',
	'',
	'Abierto',
	'Pendiente',
	'Resuelto',
	'Cerrado'
];

@Component({
  selector: 'webquid-sn005',
  templateUrl: './sn005.component.html',
  styleUrls: ['./sn005.component.scss']
})
export class Sn005Component implements OnInit {

	vacationDays: number = 10;
	requestVacationFlag: boolean = false;
	vacationForm = new FormGroup({});
	today = new Date();
	requestedDays: number = 0;
	inputDates: boolean = false;
	// previousRequest: boolean = true;
	previousRequest: boolean = false;
	requestId: string = '415';
	user: string = 'Roberto Jiménez';
	checkStatusFlag: boolean = false;
	ticketData: any;

	constructor(
		private fb: FormBuilder,
		private http: HTTPService
	) { }

	ngOnInit() {
		this.vacationForm = this.fb.group({
			beginDate: ['', Validators.required],
			endDate: ['', Validators.required],
			description: ['', Validators.required]
		}, {validator: [this.eGTb()]});
	}

	get beginDate() {
		return this.vacationForm.get('beginDate');
	}

	get endDate() {
		return this.vacationForm.get('endDate');
	}

	get description() {
		return this.vacationForm.get('description');
	}

	requestVacation() {
		this.requestVacationFlag = true;
	}

	checkStatusButton() {
		const url = 'https://aclsystemsdemo.freshservice.com';
		const bridge = 'http://localhost:3050/api/v2/tickets/custom';
		const request = {
			url: `${url}/api/v2/tickets/${this.requestId}?include=conversations`,
			apikey: 'qqUHHkIkyRx3UrXegK2U',
			method: 'get'
		};
		Swal.fire('Realizando consulta. Espera...');
		Swal.showLoading();
		this.http.post(bridge,request).subscribe(data => {
			Swal.hideLoading();
			Swal.close();
			// console.log(data);
			if(data && data.ticket) {
				this.ticketData = data.ticket;
				if(this.ticketData.status) {
					switch (this.ticketData.status) {
						case 2:
								this.ticketData.statusSpa = 'Abierta'
							break;
						case 3:
								this.ticketData.statusSpa = 'Pendiente'
							break;
						case 4:
								this.ticketData.statusSpa = 'Resuelta'
							break;
						case 5:
								this.ticketData.statusSpa = 'Cerrada'
							break;
						default:
							this.ticketData.statusSpa = 'Desconocido'
							break;
					}
				}
				if(this.ticketData.approval_status_name) {
					switch (this.ticketData.approval_status_name) {
						case 'Approved':
								this.ticketData.approvalStatusSpa = 'Aprobada'
							break;
						case 'Rejected':
								this.ticketData.approvalStatusSpa = 'Rechazada'
							break;
						case 'Cancelled':
								this.ticketData.approvalStatusSpa = 'Cancelada'
							break;
						case 'Requested':
								this.ticketData.approvalStatusSpa = 'En espera de aprobación'
							break;
						case 'Not Requested':
								this.ticketData.approvalStatusSpa = 'No solicitada'
							break;
						default:
							this.ticketData.approvalStatusSpa = 'Desconocido'
							break;
					}
				}
				this.ticketData.updatedSpa = new Date(this.ticketData.updated_at);
				this.checkStatusFlag = true;
			}
		}, error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				text: 'Ha ocurrido un error'
			});
		});
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if(control instanceof FormControl) {
				control.markAsDirty({ onlySelf: true});
				control.markAsTouched({ onlySelf: true});
			} else if(control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	eGTb() {
		return(formGroup: FormGroup)  => {
			const bDate = formGroup.controls['beginDate'];
			const eDate = formGroup.controls['endDate'];
			if(eDate.errors && !eDate.errors.eGTb) {
				return;
			}
			if(bDate.value >= eDate.value) {
				eDate.setErrors({ eGTb: true });
				bDate.setErrors({ eGTb: true });
			} else {
				eDate.setErrors(null);
				bDate.setErrors(null);
			}
		}
	}

	calcReqDays() {
		const bDate = this.vacationForm.controls['beginDate'];
		const eDate = this.vacationForm.controls['endDate'];
		this.requestedDays = getBusinessDateCount(bDate.value,eDate.value);
		this.inputDates = true;
	}

	sendRequest() {
		// console.group('sendRequest Form Valid Status')
		// console.log(this.vacationForm.valid)
		// console.groupEnd();
		if(this.vacationForm.valid) {
			const bDate = this.vacationForm.get('beginDate');
			const eDate = this.vacationForm.get('endDate');
			this.requestedDays = getBusinessDateCount(bDate.value,eDate.value);
			const description = this.vacationForm.get('description');
			const route = 'http://localhost:3050/api/v2/tickets';
			const request = {
				description: `<table width="500px"><tbody><tr><td style="padding: 5px;"><b>Colaborador</b></td><td style="padding: 5px;">${this.user}</td></tr><tr><td style="padding: 5px;"><b>Fecha de salida</b></dh><td style="padding: 5px;">${getBizDate(bDate.value)}</td></tr><tr><td style="padding: 5px;"><b>Fecha de regreso</b></td><td style="padding: 5px;">${getBizDate(eDate.value)}</td></tr><tr><td style="padding: 5px;"><b>Días solicitados</b></td><td style="padding: 5px;">${this.requestedDays}</td></tr><tr><td style="padding: 5px;"><b>Notas/Justificación:</b></td></tr><tr><td colspan=2 style="padding: 5px;">${description.value}</td></tr></tbody></table>`,
				subject: `Solicitud de vacaciones para ${this.user}`,
				email: 'lluvia_chac@hotmail.com',
				priority: 1,
				status: 2,
				type: 'Incident',
				category: 'Servicios',
				sub_category: 'RH',
				item_category: 'Vacaciones',
				source: 6,
				url: 'https://aclsystemsdemo.freshservice.com',
				apikey: 'qqUHHkIkyRx3UrXegK2U',
				assetContinue: true
			};
			if(this.requestedDays > this.vacationDays) {
				Swal.fire({
					title: '¿Estás seguro?',
					html: `El número de días solicitado (${this.requestedDays}) rebasa los días restantes de vacaciones (${this.vacationDays}).<br><b>Estás seguro que deseas continuar?</b>`,
					showCancelButton: true,
					confirmButtonColor: '#008000',
					cancelButtonColor: '#d33',
					cancelButtonText: 'Cancelar',
					confirmButtonText: 'Estoy seguro'
				}).then(result => {
					if(result.value) {
						Swal.fire('Realizando solicitud. Espera...');
						Swal.showLoading();
						this.http.post(route,request).subscribe(data => {
							if(data && data.ticket && data.ticket.id) {
								Swal.hideLoading();
								Swal.close();
								Swal.fire({
									type: 'info',
									html: `Se ha generado la solicitud con número <b>${data.ticket.id}</b>.<br>Tu solicitud debe ser aprobada antes de ser atendida.<br>Te llegará un correo con los detalles de la solicitud.`
								});
								this.previousRequest = true;
								this.requestId = data.ticket.id;
								this.requestVacationFlag = false;
								this.vacationForm.reset();
							}
						}, error => {
							console.log(error);
							Swal.hideLoading();
							Swal.close();
							Swal.fire({
								type: 'error',
								text: 'Ha ocurrido un error'
							});
						});
					}
				});
			} else {
				Swal.fire('Realizando solicitud. Espera...');
				Swal.showLoading();
				this.http.post(route,request).subscribe(data => {
					if(data && data.ticket && data.ticket.id) {
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'info',
							html: `Se ha generado la solicitud con número <b>${data.ticket.id}</b>.<br>Tu solicitud debe ser aprobada antes de ser atendida.<br>Te llegará un correo con los detalles de la misma.`
						});
						this.previousRequest = true;
						this.requestId = data.ticket.id;
						this.requestVacationFlag = false;
						this.vacationForm.reset();
					}
				}, error => {
					console.log(error);
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'error',
						text: 'Ha ocurrido un error'
					});
				});
			}
		} else {
			this.validateAllFormFields(this.vacationForm);
		}
	}

}

function getBusinessDateCount (startDate: Date, endDate: Date) {
		var elapsed: number,
		daysBeforeFirstSaturday: number,
		daysAfterLastSunday: number;
		var ifThen = function (
			a:number,
			b: number,
			c: number
		) {
			return a == b ? c : a;
		};

		elapsed = +endDate - +startDate;
		elapsed /= 86400000;

		daysBeforeFirstSaturday = (7 - startDate.getDay()) % 7;
		daysAfterLastSunday = endDate.getDay();

		elapsed -= (daysBeforeFirstSaturday + daysAfterLastSunday);
		elapsed = (elapsed / 7) * 5;
		elapsed += ifThen(daysBeforeFirstSaturday - 1, -1, 0) + ifThen(daysAfterLastSunday, 6, 5);

		return Math.ceil(elapsed);
}

function getBizDate(bizDate: Date) {
	const months = [
		'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
		'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
	];
	return `${months[bizDate.getMonth()]} ${bizDate.getDate()} ${bizDate.getFullYear()}`
}
