import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { RequestService } from '../services/requests.service';

@Component({
  selector: 'mat-libreta-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

	loading: boolean = false;
	groupid: string;
	group: any;

  constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private requestService: RequestService
	) {
		this.activatedRoute.params.subscribe(params => {
			this.groupid = params.groupid;
		});
	}

  ngOnInit(): void {
		if(!this.groupid) this.router.navigate(['/requests']);
		this.getGroup();
  }

	getGroup() {
		this.loading = true;
		this.requestService.getGroup(this.groupid).subscribe(data => {
			this.group = Object.assign({},data);
			// console.log(this.group);
			this.loading = false;
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				html: `No pudo descargarse la información del grupo.<br>${error}`
			});
			this.router.navigate(['/requests']);
			this.loading = false;
		})
	}

	changeTutor() {
		Swal.fire({
			title: `Cambio de instructor para el grupo ${this.group.code}`,
			text: 'Nota: El instructor ya debe estar registrado en plataforma',
			inputPlaceholder: 'Correo del instructor',
			input: 'email',
		}).then(email => {
			if(email.value) {
				Swal.fire({
					text: 'Espera...',
					allowOutsideClick: () => !Swal.isLoading()
				});
				Swal.showLoading();
				this.requestService.validateInstructor(email.value).subscribe(data => {
					const instructor:any = data;
					if(instructor.message && instructor.message.includes('Usuario no existe')){
						Swal.fire({
							type: 'error',
							html: `Usuario <b>${email.value}</b> no existe`
						});
						return;
					}
					if(instructor.message && instructor.message.includes('No autorizado')) {
						Swal.fire({
							type: 'error',
							text: 'No estás autorizado a realizar esta operación'
						});
						return;
					}
					this.requestService.changeInstructor(this.groupid,instructor._id).subscribe(data => {
						this.getGroup();
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'success',
							text: data.message
						});
					}, error => {
						Swal.hideLoading();
						Swal.close();
						Swal.fire({
							type: 'error',
							text: `Hubo un error en la consulta: ${error.error.message}`
						});
						console.log(error);
					});
				}, error => {
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'error',
						text: `Hubo un error en la consulta: ${error.error.message}`
					});
					console.log(error);
				});
			}
		});
	}

	modifyGroup(field:string) {
		console.log(field);
		if(field.includes('beginDate') || field.includes('endDate')) {
			const now = new Date();
			const months = [
				'Enero','Febrero','Marzo','Abril',
				'Mayo','Junio','Julio','Agosto',
				'Septiembre','Octubre','Noviembre','Diciembre'
			];
			var monthsString = '';
			const month = now.getMonth();
			for(var i=0;i<months.length;i++) {
				monthsString += (i === month) ? `<option value="${month+1}" selected>${months[i]}</option>
				` : `<option value="${i+1}">${months[i]}</option>
				`
			}
			Swal.fire({
				title: 'Selecciona la fecha',
				html: `<input type="number" id="day" value="${+now.getDate()}"><br>
				<select id="month">
					${monthsString}
				</select><br>
				<input type="number" id="year" value="${+now.getFullYear()}">`,
				showConfirmButton: true,
				confirmButtonText: 'Cambiar',
				confirmButtonColor: 'green',
				showCancelButton: true,
				cancelButtonText: 'Cancelar',
				cancelButtonColor: 'red',
				preConfirm: () => {
					return [
						(<HTMLInputElement>document.getElementById('day')).value,
						(<HTMLInputElement>document.getElementById('month')).value,
						(<HTMLInputElement>document.getElementById('year')).value
					];
				}
			}).then((results) => {
				if(results.dismiss) {
					console.log('Bye');
					return;
				}
				console.log(results.value);
				Swal.fire('Espera...');
				Swal.showLoading();
				var groupToSend = {};
				if(field.includes('beginDate') || field.includes('endDate')) {
					const [day,month,year] = results.value;
					const newDate = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')} 00:00`;
					console.log(newDate);
					groupToSend[field] = (field.includes('beginDate') || field.includes('endDate')) ? new Date(newDate) : '';;
				}
				this.requestService.modifyGroup(this.groupid,groupToSend).subscribe(data => {
					Swal.hideLoading();
					Swal.close();
					if(data.message) {
						Swal.fire({
							type: 'warning',
							text: data.message
						});
					} else {
						this.group = data;
						Swal.fire({
							type: 'success',
							text: 'Fecha modificada'
						});
					}
				}, error => {
					console.log(error);
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'error',
						text: error.error.message
					})
				});
			})
		}
	}
}
