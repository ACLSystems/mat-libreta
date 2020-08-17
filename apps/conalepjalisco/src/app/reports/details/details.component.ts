import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder } from '@angular/forms';
import localeEs from '@angular/common/locales/es';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import Swal from 'sweetalert2';

registerLocaleData(localeEs,'es-MX');
declare const $: any;

import { SuperService, DtOptions } from '@mat-libreta/shared';

type Detail = {
	course?: {
		title?: string,
		_id?: string
	},
	finalGrade?: number,
	status?: string,
	student?: {
		name?: string,
		person?: {
			birthDate?: string,
			email?: string,
			fatherName?: string,
			motherName?: string,
			name?: string
		}
	},
	track?: number,
	_id?: string
};

interface LastMonth {
  view: string,
	viewValue: string
}

@Component({
  selector: 'mat-libreta-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterViewInit {

	loading: boolean = false;
	thisMonth: Date = new Date();
	thisMonthString: string;
	details: Detail[] = [];
	detailsRaw: Detail[] = [];
	lastMonths: LastMonth[] = [];
	approved: number;
	certificate: number;
	courses: string[] = [];
	dtOptions = DtOptions;
	tableHeader: string[];

	exportAsConfig: ExportAsConfig = {
		type: 'xlsx',
		elementIdOrContent: 'allDetails'
	}

	selectionForm = this.fb.group({
		month: [0],
		filter: [''],
		course: ['']
	});

  constructor(
		private superService: SuperService,
		private router: Router,
		private fb: FormBuilder,
		private exportAsService: ExportAsService
	) {
		this.thisMonthString = this.formatThisMonth(this.thisMonth);
		this.tableHeader = [
			'#',
			'Participante',
			'Curso',
			'Constancia',
			'Avance',
			'Cal. Final'
		];
	}

  ngOnInit(): void {
		this.getData(0);
		for(var i=0;i < 6;i++) {
			this.lastMonths.push({
				viewValue: this.formatThisMonth(addMonths(this.thisMonth,-i)),
				view: 0 - i + ''
			});
		}
		// console.log(this.lastMonths);
  }

	ngAfterViewInit() {
		// $('#datatables').DataTable({
    //   "pagingType": "full_numbers",
    //   "lengthMenu": [
    //     [10, 25, 50, -1],
    //     [10, 25, 50, "Todos"]
    //   ],
    //   responsive: true,
    //   language: {
    //     search: "_INPUT_",
    //     searchPlaceholder: "Buscar",
    //   }
		//
    // });
		//
    // const table = $('#datatables').DataTable();
	}

	export() {
		const today = new Date();
		this.exportAsService.save(this.exportAsConfig, `Inscripciones-${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`).subscribe(() => {});
	}

	formatThisMonth(date:Date) {
		const pipe = new DatePipe('es-MX');
		var monthString = pipe.transform(date, 'MMMM').toUpperCase();
		monthString = `${monthString} ${date.getFullYear()}`
		return monthString;
	}

	getData(offset:number) {
		this.loading = true;
		Swal.fire({
			type: 'warning',
			title: 'Estamos cargando la información',
			text: 'Este proceso puede tardar unos segundos. Sugerimos interactuar algunos segundos despues de la carga para una mejor experiencia',
			showCloseButton: false
		});
		Swal.showLoading();
		const monthOffset = addMonths(this.thisMonth,offset);
		this.thisMonthString = this.formatThisMonth(monthOffset);
		const sendMonth = `${monthOffset.getFullYear()}-${monthOffset.getMonth()+1}-${monthOffset.getDate()}`;
		this.superService.getDetails(sendMonth).subscribe(data => {
			// console.log(data);
			if(Array.isArray(data)) {
				this.detailsRaw = [...data];
				this.details = [...data];
				this.courses = [...new Set(data.map(roster => roster.course.title))].sort();
				this.approved = data.reduce((acc,value) => {
					if(value.track >= 70 && value.finalGrade >= 60) {
						return acc + 1;
					} else {
						return acc;
					}
				},0);
				this.certificate = data.reduce((acc,value) => {
					if(value.status === 'active') {
						return acc + 1;
					} else {
						return acc;
					}
				},0);
				// console.log(this.approved);
				// console.log(this.certificate);
				// console.log(this.courses);
				setTimeout(() => {
					Swal.hideLoading();
					Swal.close();
					this.loading = false;
				},2000);
			} else {
				Swal.hideLoading();
				Swal.close();
				this.loading = false;
			}
		}, error => {
			console.log(error);
			this.loading = false;
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				text: 'Hubo un error en la comunicación con el servidor. Intenta nuevamente en unos minutos. Si el problema persiste, comunícate a la mesa de servicio.'
			});
		});
	}

	reload(event:MatDatepickerInputEvent<Date>) {
		console.log(event);
		this.getData(0);
		this.selectionForm.reset();
	}

	return() {
		this.router.navigate(['/reports']);
	}

	selected(monthSelected:any) {
		// console.log(monthSelected);
		this.getData(+monthSelected);
	}

	filtered(filter:string) {
		console.log(filter);
		if(filter==='approved') {
			this.details = this.detailsRaw.filter(det => det.finalGrade >= 60 && det.track >= 70);
			return;
		}
		if(filter==='certificate') {
			this.details = this.detailsRaw.filter(det => det.status === 'active');
			return;
		}
		if(filter === '') {
			this.details = [...this.detailsRaw];
			return;
		}
		// aquí ponemos los cursos
		this.details = this.detailsRaw.filter(det => det.course.title === filter);
		return;
	}

	reset() {
		this.selectionForm.reset();
		this.details = [...this.detailsRaw];
	}

	ordered(param:string) {

	}

}

function addMonths(date:Date, months:number) {
	// console.group('AddMonths');
	// console.log(date,months);
	// console.groupEnd();
	const dateString = `${date.getFullYear()}-${date.getMonth()+1}-15`;
	// console.log(dateString);
	var newDate = new Date(dateString);
	newDate.setMonth(newDate.getMonth() + months);
	// console.log(newDate);
	return newDate;
}
