import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Identity } from '@wqshared/types/user.type';
import { UserService } from '@wqshared/services/user.service';
import { PDFService } from '@wqshared/services/pdf.service';

@Component({
  selector: 'webquid-sn001',
  templateUrl: './sn001.component.html',
  styleUrls: ['./sn001.component.scss']
})
export class SN001Component implements OnInit {

	loading: boolean = false;
	documents: any[] = [];
	identity: Identity;
	userTag: string;
	document: any;

  constructor(
		private userService: UserService,
		private pdfService: PDFService,
		private router: Router
	) { }

  ngOnInit(): void {
		this.getIdentity();
		this.getDocumentsList();
  }

	getIdentity() {
		this.identity = this.userService.getidentity();
		if(this.identity.person) {
			this.userTag = `${this.identity.person.name} ${this.identity.person.fatherName} ${this.identity.person.motherName}`
		} else {
			this.userTag = `${this.identity.identifier}`
		}
	}

	getDocumentsList() {
		this.loading = true;
		this.userService.searchMyDocuments('documentType=cfdi&subDocumentType=nomina12').subscribe(data => {
			if(data && Array.isArray(data) && data.length >0) {
				this.documents = [...data];
			}
			// console.log(this.documents);
			this.loading = false;
		}, error => {
			console.log(error);
			this.loading = false;
		})
	}

	getDocument(docid:string) {
		Swal.fire('Espera');
		Swal.showLoading();
		if(this.document && this.document._id + '' === docid) {
			// console.log(`Ya habíamos bajado el ${docid}`);
			Swal.hideLoading();
			Swal.close();
			this.saveDocument(this.document.data,`${this.document.documentNumber}.xml`,this.document.mimeType);
			return;
		}
		this.userService.getDocument(docid).subscribe(data => {
			// console.log(data);
			if(data && data._id) {
				this.document = data;
				this.saveDocument(this.document.data,`${this.document.documentNumber}.xml`,this.document.mimeType);
			}
			Swal.hideLoading();
			Swal.close();
		},error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				text: `Hubo un error en la descarga: ${error.error.message}`
			});
		});
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
		this.userService.getDocument(docid).subscribe(data => {
			// console.log(data);
			if(data && data._id) {
				this.document = data;
				// Correr el PDF
				this.pdfService.printPDFNomina12(this.document.json);
				// console.log('Correr PDF');
			}
			Swal.hideLoading();
			Swal.close();
		},error => {
			console.log(error);
			Swal.hideLoading();
			Swal.close();
			Swal.fire({
				type: 'error',
				text: `Hubo un error en la descarga: ${error.error.message}`
			});
		});
	}

	saveDocument(content:any, fileName:string, contentType:string) {
		var a = document.createElement('a');
		var file = new Blob([content], {type: contentType});
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.click();
	}

}
