import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

import { OperService } from '../services/oper.services';
// import { CommonService } from '@mat-libreta/shared';
import { NotElemService } from '@mat-libreta/shared';
import { PDFService } from '@wqshared/services/pdf.service';

@Component({
  selector: 'webquid-payroll-receipts',
  templateUrl: './payroll-receipts.component.html',
  styleUrls: ['./payroll-receipts.component.scss']
})
export class PayrollReceiptsComponent implements OnInit {

	@Input() userid: string;
	@Input() userTag: string;
	@Output() backToUser = new EventEmitter<boolean>();
	userLoading: boolean = false;
	documents: any[] = [];
	document: any;
	datesForms = this.fb.group({
		dateYear:[''],
		dateMonth:['']
	});

	years: string[] = [];
	months: string[] = [
		'Enero','Febrero','Marzo',
		'Abril','Mayo','Junio',
		'Julio','Agosto','Septiembre',
		'Octubre','Noviembre','Diciembre'
	];


  constructor(
		private operService: OperService,
		private notElemService: NotElemService,
		private pdfService: PDFService,
		private fb: FormBuilder
	) { }

	get dateYear() {
		return this.datesForms.get('dateYear');
	}
	get dateMonth() {
		return this.datesForms.get('dateMonth');
	}

  ngOnInit(): void {
		this.setFields();
		// console.log(this.userid);
		this.getDocumentsList();
  }

	setFields() {
		const thisYear = new Date().getFullYear();
		const thisMonth = this.months[new Date().getMonth()];
		// console.log(thisYear,thisMonth);
		this.dateYear.setValue(thisYear +'');
		this.dateMonth.setValue(thisMonth);
		for(let i=0;i<5;i++) {
			this.years.push(thisYear - i + '');
		}
	}

	goBack() {
		// console.log('Click en regresar')
		this.backToUser.emit(false);
	}

	search(){
		const month = this.months.findIndex(m => m === this.dateMonth.value);
		this.getDocumentsList(new Date(this.dateYear.value,month,15));
	}

 	getDocumentsList(date?:Date) {
		// console.log('date',date);
		Swal.fire('Espera...');
		Swal.showLoading();
		this.operService.searchUserDocuments(this.userid,date).subscribe(data => {
			this.documents = [...data];
			// console.log(this.documents);
			if(this.documents.length === 0) {
				this.notElemService.showNotification(
					'bottom',
					'left',
					'warning',
					'No hay recibos disponibles para estas fechas'
				);
			} else {
				this.notElemService.showNotification(
					'bottom',
					'left',
					'success',
					'Búsqueda exitosa'
				);
			}
			Swal.hideLoading();
			Swal.close();
		}, error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			this.notElemService.showNotification(
				'bottom',
				'left',
				'danger',
				'Error en la descarga'
			);
		})
	}

	getDocument(docid:string) {
		Swal.fire('Espera');
		Swal.showLoading();
		// console.log(docid);
		if(this.document && this.document._id + '' === docid) {
			// console.log(`Ya habíamos bajado el ${docid}`);
			Swal.hideLoading();
			Swal.close();
			this.saveDocument(this.document.data,`${this.document.documentNumber}.xml`,this.document.mimeType);
			this.notElemService.showNotification(
				'bottom',
				'left',
				'warning',
				'Documento ya descargado'
			);
			return;
		}
		this.operService.getUserDocument(docid).subscribe(data => {
			// console.log(data);
			if(data && data._id) {
				this.document = data;
				this.saveDocument(this.document.data,`${this.document.documentNumber}.xml`,this.document.mimeType);
				this.notElemService.showNotification(
					'bottom',
					'left',
					'success',
					'Documento descargado'
				);
			}
			Swal.hideLoading();
			Swal.close();
		},error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			this.notElemService.showNotification(
				'bottom',
				'left',
				'danger',
				'Error en la descarga'
			);
		});
	}

	saveDocument(content:any, fileName:string, contentType:string) {
		var a = document.createElement('a');
		var file = new Blob([content], {type: contentType});
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	}

	getPDF(docid:string) {
		Swal.fire('Espera');
		Swal.showLoading();
		if(this.document && this.document._id + '' === docid) {
			// console.log(`Ya habíamos bajado el ${docid}`);
			Swal.hideLoading();
			Swal.close();
			// correr el PDF
			this.pdfService.printPDFNomina12(this.document.json);
			return;
		}
		this.operService.getUserDocument(docid).subscribe(data => {
			// console.log(data);
			if(data && data._id) {
				this.document = data;
				// Correr el PDF
				this.pdfService.printPDFNomina12(this.document.json);
				this.notElemService.showNotification(
					'bottom',
					'left',
					'success',
					'<i class="far fa-thumbs-up"></i> Documento descargado'
				);
				// console.log('Correr PDF');
			}
			Swal.hideLoading();
			Swal.close();
		},error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			this.notElemService.showNotification(
				'bottom',
				'left',
				'danger',
				'<i class="fas fa-times-circle"></i> Error en la descarga'
			);
		});
	}
}
