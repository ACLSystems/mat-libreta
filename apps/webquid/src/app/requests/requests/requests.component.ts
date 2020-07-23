import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import Swal from 'sweetalert2';

import { DtOptions } from '@mat-libreta/shared';
import { UserService,  } from '@wqshared/services/user.service';
import { JobsService } from '@wqshared/services/jobs.service';
import { CommonService } from '@wqshared/services/common.service';

registerLocaleData(localeMX);

@Component({
  selector: 'webquid-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
	providers: [

	]
})
export class RequestsComponent implements OnInit {

	allRequests: any[] = [];
	requests: any[] = [];
	loading: boolean = false;
	dtOptions = DtOptions;
	tableHeader: string[];
	request: number | any = 0;
	candidates: any[] = [];
	viewCandidate: boolean = false;
	readyCandidate: boolean = false;
	candidate: any;
	refreshing: boolean = false;
	seeingAll: boolean = false;
	reqid: number;
	// refreshed: boolean = false;
	progress: string = '0';
	progressStyle: string = 'width: 0%;';
	progressColor: string = 'bg-success';

  constructor(
		private userService: UserService,
		private jobsService: JobsService,
		private commonService: CommonService,
		private router: Router
	) {
		this.tableHeader = [
			'Ticket',
			'Estado',
			'Autorización',
			'Asunto',
			'Fecha de creación',
			'Acciones'
		];
	}

  ngOnInit(): void {
		this.getMyRequests();
  }

	getMyRequests(all?:boolean) {
		this.loading = true;
		Swal.fire('Obteniendo lista de tickets. Espera...');
		Swal.showLoading();
		if(all) this.seeingAll = true;
		this.userService.getMyRequests(all).subscribe(data => {
			if(data) {
				this.allRequests = [...data];
			}
			this.requests = this.allRequests.filter(req => req.freshStatus !== 'Closed');
			// if(!this.refreshed) {
			// 	Swal.close();
			// 	Swal.fire('Actualizando tickets...');
			// 	Swal.showLoading();
			// 	this.refreshing = true;
			// 	this.refreshTicket(0);
			// } else {
				Swal.hideLoading();
				Swal.close();
			// 	this.loading = false;
			// }
			this.loading = false;
			this.commonService.displayLog('Requests', this.requests);
		}, error => {
			console.log(error);
			this.loading = false;
			Swal.fire({
				type: 'error',
				text: 'Hubo un error al intentar recobrar las solicitudes. Intenta más tarde. Si esto persiste en varias ocasiones favor de reportarlo'
			});
			this.router.navigate(['/services']);
		})
	}

	refreshTicket(index:number) {
		if(this.requests[index]) {
			this.refreshing = true;
			const ticket = this.requests[index];
			// console.log(ticket.freshid);
			// Swal.close();
			// Swal.fire(`Actualizando tickets ${ticket.freshid}`);
			// Swal.showLoading();
			let len = this.requests.length;
			this.userService.refreshRequest(ticket.freshid).subscribe(data => {
				this.progress = index + 1 + '';
				let width = Math.floor((index+1)*100/len);
				this.progressStyle = `width: ${width}%;`;
				this.refreshTicket(index+1);
			}, error => {
				console.log(error);
				this.refreshTicket(index+1);
			});
		} else {
			this.refreshing = false;
		}
	}

	refreshOneTicket(index:number) {
		if(this.requests[index]) {
			this.refreshing = true;
			const ticket = this.requests[index];
			// console.log(ticket.freshid);
			// Swal.close();
			// Swal.fire(`Actualizando tickets ${ticket.freshid}`);
			// Swal.showLoading();
			let len = this.requests.length;
			this.userService.refreshRequest(ticket.freshid).subscribe(data => {
				this.refreshing = false;
			}, error => {
				console.log(error);
			});
		} else {
			this.refreshing = false;
		}
	}

	goRequest(request:number){
		this.readyCandidate = false;
		this.reqid = request;
		Swal.fire('Cargando ticket. Espera...');
		Swal.showLoading();
		this.request = this.requests.find(req => req.freshid === request);
		// console.log(this.request);
		this.tableHeader = [
			'#',
			'Ticket',
			'Candidato',
			'Puesto/Plaza',
			'Creado',
			'Status'
		];
		if(this.request && this.request.data && this.request.data.service_request && this.request.data.service_request.subject &&
		this.request.data.service_request.subject.includes('Requisición de Personal')) {
			this.viewCandidate = true;
			this.tableHeader.push('Acciones')
			this.readyCandidate = true;
		} else {
			this.viewCandidate = false;
			this.readyCandidate = true;
		}
		this.jobsService.getCVs(request).subscribe(data => {
			if(data && data.length > 0) {
				this.candidates = [...data];
			} else {
				this.candidates = [];
			}
			// console.log(this.candidates);
			Swal.hideLoading();
			Swal.close();
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				html: `<p>Ocurrió un error. Espera unos minutos y reintenta</p><p>Error: ${error.error.message}</p>`
			});
			Swal.hideLoading();
			Swal.close();
		})
	}

	goTable() {
		this.request = 0;
		this.tableHeader = [
			'Ticket',
			'Estado',
			'Autorización',
			'Asunto',
			'Fecha de creación',
			'Acciones'
		];
	}

	goCandidate(candidate:number) {
		// this.candidate = this.candidates[candidate];
		// // console.log(this.candidate);
		// if(candidate + 1 < this.candidates.length) {
		// 	this.candidate.nextCandidate = candidate + 1;
		// }
		// if(candidate > 0) {
		// 	this.candidate.prevCandidate = candidate - 1;
		// }
		// window.scroll(0,0);
		this.router.navigate(['/jobs/job'],{state: {data: this.candidates[candidate]}});
	}

	returnRequests() {
		this.candidate = false;
	}

	reply() {
		if(this.request === 0 || !this.request.freshid) {
			return;
		}
		Swal.fire({
			title: `Comentario a Solicitud ${this.request.freshid}`,
			input: 'textarea',
			inputPlaceholder: 'Escribe tu comentario',
			inputAttributes: {
				'aria-label': 'Escribe tu comentario'
			},
			showCancelButton: true
		}).then((results) => {
			Swal.fire('Enviando...');
			Swal.showLoading();
			this.userService.reply(this.request.freshid,results.value).subscribe(()  => {
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'success',
					text: 'Tu mensaje fue enviado'
				});
				this.refreshOneTicket(this.reqid);
				this.getMyRequests();
			}, error => {
				console.log(error);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					text: 'Tu mensaje no pudo ser enviado'
				});
			});
		})
	}

}
