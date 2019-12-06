import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from '@crmshared/services/user.service';
import { Contact } from '@crmshared/types/contact.type';

@Component({
  selector: 'mat-libreta-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewUserComponent implements OnInit {

	users: Contact[] = [];

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
			'Email',
			'Nombre',
			'Cuenta(s)',
			'Dueño',
			'Acciones'
		];
	}

  ngOnInit() {
		this.loading = true;
		this.userService.usersList().subscribe(data => {
			// console.log(data);
			this.users = data;
			this.users.forEach(user => {
				if(!user.owner) {
					user.owner = {
						_id: '',
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
			Swal.fire({
				type: 'error',
				title: 'Hubo un error',
				text: error
			})
			console.log(error);
		});
  }

	createUser() {
		this.router.navigate(['/users/create'])
	}

}
