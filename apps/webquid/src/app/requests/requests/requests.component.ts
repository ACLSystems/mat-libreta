import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { DtOptions } from '@mat-libreta/shared';
import { UserService,  } from '@wqshared/services/user.service';
import { JobsService } from '../../jobs/services/jobs.service';

@Component({
  selector: 'webquid-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
	providers: [

	]
})
export class RequestsComponent implements OnInit {

	requests: any[] = [];
	loading: boolean = false;
	dtOptions = DtOptions;
	tableHeader: string[];
	request: number | any = 0;
	candidates: any[] = [];

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
				this.requests = [...data];
			}
			this.loading = false;
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
		Swal.fire('Cargando candidatos. Espera...');
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
		this.jobsService.getCVs(request).subscribe(data => {
			if(data && data.length > 0) {
				this.candidates = [...data];
			} else {
				this.candidates = [];
			}
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

}
