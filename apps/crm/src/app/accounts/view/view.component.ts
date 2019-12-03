import { Component, OnInit, AfterViewInit } from '@angular/core';

import { UserService } from '@crmshared/services/user.service';
import { Account } from '@crmshared/types/accounts.type';

declare const $: any;

@Component({
	selector: 'mat-libreta-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss']
})
export class ViewAccountsComponent implements OnInit, AfterViewInit {

	accounts: Account[] = [];
	tableHeader: string[];
	loading: boolean;

	constructor(
		private userService: UserService
	) {
		this.tableHeader = [
			'Nombre',
			'Razón Social',
			'Tipo',
			'Dueño',
			'Acciones'
		];
	}

	ngOnInit() {
		this.loading = true;
		this.userService.orgList().subscribe(data => {
			console.log(data);
			this.accounts = data;
			this.accounts.forEach(acc => {
				if(!acc.owner) {
					acc.owner = {
						name: '',
						person: {
							name: '',
							fatherName: '',
							motherName: '',
							email: ''
						}
					};
				}
			});
			this.loading = false;
		}, error => {
			console.log(error);
		})
	}

	ngAfterViewInit() {
		$('#accounts').DataTable({
			"pagingType": "full_numbers",
			"lengthMenu": [
				[10, 25, 50, -1],
				[10, 25, 50, "Todos"]
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

		});

		const table = $('#accounts').DataTable();

		// Edit record
		table.on('click', '.edit', function(e) {
			let $tr = $(this).closest('tr');
			if ($($tr).hasClass('child')) {
				$tr = $tr.prev('.parent');
			}

			var data = table.row($tr).data();
			alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
			e.preventDefault();
		});

		// Delete a record
		table.on('click', '.remove', function(e) {
			const $tr = $(this).closest('tr');
			table.row($tr).remove().draw();
			e.preventDefault();
		});

		//Like record
		table.on('click', '.like', function(e) {
			alert('You clicked on Like button');
			e.preventDefault();
		});

		$('.card .material-datatables label').addClass('form-group');
	}

}
