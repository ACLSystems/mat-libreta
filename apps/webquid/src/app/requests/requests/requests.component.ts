import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import Swal from 'sweetalert2';

import { DtOptions } from '@mat-libreta/shared';
import { UserService,  } from '@wqshared/services/user.service';
import { JobsService } from '@wqshared/services/jobs.service';

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

  constructor(
		private userService: UserService,
		private jobsService: JobsService,
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
		this.loading = true;
		this.getMyRequests();
  }

	getMyRequests() {
		this.userService.getMyRequests().subscribe(data => {
			if(data) {
				this.allRequests = [...data];
			}
			this.loading = false;
			this.requests = this.allRequests.filter(req => req.freshStatus !== 'Closed');
			// console.log(this.requests);
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

	goRequest(request:number){
		this.readyCandidate = false;
		Swal.fire('Cargando ticket. Espera...');
		Swal.showLoading();
		this.request = this.requests.find(req => req.freshid === request);
		console.log(this.request);
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
			console.log(this.candidates);
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
		this.candidate = this.candidates[candidate];
		console.log(this.candidate);
		if(candidate + 1 < this.candidates.length) {
			this.candidate.nextCandidate = candidate + 1;
		}
		if(candidate > 0) {
			this.candidate.prevCandidate = candidate - 1;
		}
		window.scroll(0,0);
	}

	returnRequests() {
		this.candidate = false;
	}

}
