import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { RequestService } from '../services/requests.service';

import { DtOptions } from '@mat-libreta/shared';

interface RubricBlock {
	section: number,
	number: number,
	w: number,
	wq: number,
	wt: number
	title?: string,
	block?: string,
	weight?: number,
	_id?: string
}

@Component({
  selector: 'mat-libreta-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

	loading: boolean = false;
	groupid: string;
	group: any;
	rubric: {
		course: {
			rubric: RubricBlock[]
		},
		group: {
			code: string,
			name: string,
			_id: string
		},
		rubric: RubricBlock[]
	};
	rubricLoad: boolean = false;
	dtOptions = DtOptions;
	tableHeaderGroup: string[];
	tableHeaderRubric: string[];

  constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private requestService: RequestService
	) {
		this.activatedRoute.params.subscribe(params => {
			this.groupid = params.groupid;
		});
		this.tableHeaderGroup = [
			'Nombre',
			'Apellidos',
			'Correo'
		];
		this.tableHeaderRubric = [
			'Sección',
			'Lección',
			'Título',
			'',
			'W',
			'WQ',
			'WT'
		];
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
			// this.loading = false;
			this.getRubric();
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

	getRubric() {
		if(this.rubricLoad) {
			return;
		}
		this.loading = true;
		this.requestService.getRubric(this.groupid).subscribe(data => {
			console.log(data);
			this.rubric = data;
			this.rubric.rubric = calculateRubric(this.rubric.rubric);
			this.loading = false;
			this.rubricLoad = true;
			calculateRubric(this.rubric.rubric);
		}, error => {
			console.log(error);
			this.loading = false;
		});
	}

	modifyGroup(field:string) {
		// console.log(field);
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
					// console.log('Bye');
					return;
				}
				// console.log(results.value);
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

	calculateRubric(section: number, number: number, mod: number) {
		const foundEntry = this.rubric.rubric.findIndex(e => e.section === section && e.number === number);
		if(foundEntry > -1) {
			const currentValue = this.rubric.rubric[foundEntry].w
			if(currentValue === 0 && mod < 0) {
				Swal.fire({
					type: 'warning',
					text: 'Valores menores a cero no son válidos'
				});
				return;
			}
			this.rubric.rubric[foundEntry].w += +mod;
		}
		this.rubric.rubric = calculateRubric(this.rubric.rubric);
	}

	resetRubric() {
		Swal.fire('Espera...');
		Swal.showLoading();
		this.requestService.resetRubric(this.groupid).subscribe(data => {
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'success',
				text: data.message
			});
			this.getRubric();
		}, error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				text: error.error.message
			});
		});
	}

	setRubric() {
		Swal.fire('Espera...');
		Swal.showLoading();
		this.requestService
			.setRubric(this.groupid,this.rubric.rubric).subscribe(data => {
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'success',
					text: data.message
				});
				this.getRubric();
			}, error => {
				console.log(error);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					text: error.error.message
				});
			})
	}
}

function calculateRubric(rubric: any[]) {
	if(!Array.isArray(rubric)) {
		return rubric;
	}
	rubric.forEach(e => e.weight = 0);
	var sections = rubric.map((item:any) => item.section);
	var sectionW = rubric.filter((item:any) => item.number === 0).map(item => item.w);
	sections = [... new Set(sections)];
	console.log('Sections:');
	console.log(sections);
	console.log('SectionsW:');
	console.log(sectionW);
	const overallSections = sectionW.reduce((acc,value) => acc + value, 0);
	if(overallSections === 0) {
		return rubric;
	}
	console.log('Overall', overallSections);

	for(var i=0;i<sections.length;i++) {
		// nos vamos sección por sección y calculamos el 100% de cada sección
		var totalNumbers = rubric.filter(item => item.section === i && item.number !== 0);
		console.log('totalNumbers');
		console.log(totalNumbers);
		var totalSection = totalNumbers.reduce((acc,value) => acc + value.w, 0);
		console.log('totalSection:',totalSection);
		if(totalSection > 0) {
			console.log('Sección: ', i, 'Total', totalSection);
			for(let entry of totalNumbers) {
				var foundEntry = rubric.findIndex(e => e.section === entry.section && e.number === entry.number);
				if(foundEntry > -1) {
					rubric[foundEntry].weight = round(100 * rubric[foundEntry].w / totalSection, 2);
					console.log('i',i,'W',rubric[foundEntry].w, totalSection,100 * rubric[foundEntry].w / totalSection)
				}
			}
		}
		var foundSection = rubric.findIndex(s => s.section === i && s.number === 0);
		if(foundSection > -1) {
			rubric[foundSection].weight = round(100 * +rubric[foundSection].w / overallSections, 2);
		}
	}
	// console.log(rubric);
	return rubric;
}

function round(num:number, places?:number) {
	if(!places) {
		return Math.round(num);
	} else {
		let val = Math.pow(10, places);
		return Math.round(num*val) / val;
	}
}
