import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';

import { UserService } from '@crmshared/services/user.service';
import { Business } from '@crmshared/classes/business.class';

registerLocaleData(localeMX);

@Component({
	selector: 'mat-libreta-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
	providers: [
		{ provide: LOCALE_ID, useValue: 'es-MX'}
	]
})
export class ViewBusinessComponent implements OnInit {

	businesses: Business[] = [];
	tableHeader: string[];
	loading: boolean;
	dtOptions = {
		"pagingType": "full_numbers",
		"lengthMenu": [
			[5, 10, 25, 50, -1],
			[5, 10, 25, 50, "Todos"]
		],
		responsive: true,
		language: {
			search: "_INPUT_",
			searchPlaceholder: "Buscar",
			emptyTable: 'No hay datos disponibles en la tabla',
			lengthMenu: 'Mostrar _MENU_ registros',
			info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
			infoEmpty: 'No hay registros para mostrar',
			loadingRecords: 'Cargando registros',
			infoFiltered: '(filtrando _MAX_ en total)',
			paginate: {
				first: 'Primero',
				previous: 'Anterior',
				next: 'Siguiente',
				last: 'Último'
			},
			aria: {
				sortAscending: ': active para ordenar la columna en orden ascendente',
				sortDescending: ': active para ordenar la columna en orden descendente'
			}
		}
	}

	constructor(
		private userService: UserService,
		private router: Router
	) {
		this.tableHeader = [
			'Nombre',
			'Valor',
			'Status',
			'Fecha esperada de cierre',
			'Vendedor',
			'Cuenta',
			'Acciones'
		];
		this.loading = true;
	}

	ngOnInit() {
		this.loading = true;
		this.userService.businessList().subscribe(data => {
			if(data && Array.isArray(data) && data.length > 0) {
				data.forEach(d => {
					this.businesses.push(new Business(d));
				});
			}
			this.displayLog('Negocios', this.businesses);
			this.loading = false;
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				title: 'Hubo un error',
				text: error.message
			})
		});
	}

	createBusiness() {
		this.router.navigate(['/business/create'])
	}

	displayLog(display:string, obj: any) {
		console.group(display);
		console.log(obj);
		console.groupEnd();
	}

}
