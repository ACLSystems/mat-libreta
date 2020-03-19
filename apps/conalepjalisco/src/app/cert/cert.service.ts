import { Injectable} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import * as qrious from 'qrious';

@Injectable()
export class CertService {

	constructor(
		public decimal:DecimalPipe
	) {}

	printCertificate(
		document:string,
		certificateNumber:string,
		nameStudent: string,
		course: string,
		finalGrade: string,
		time: string,
		units: string,
		passDate: string,
		// docName: string
	) {
		let grade:string = this.decimal.transform(finalGrade,'.0-2');
		var doc = new jsPDF({
			orientation: 'l',
			unit: 'px'
			// format: [814,1053]
		});

		doc.addImage(document,'jpg',0,1);

		//Seccion de los folios
		doc.setFont("Helvetica");
		doc.setFontSize(12);
		doc.setTextColor(255,0,0);
		doc.text(499,81,"Folio "+certificateNumber,null,null);

		// A
		doc.setFont("Helvetica");
		doc.setFontSize(14);
		doc.setTextColor(100);
		doc.text(300,225,'A',null,null,'center');

		// Seccion del nombre del alumno
		doc.setFont("Helvetica");
		doc.setFontType('bold');
		doc.setFontSize(28);
		doc.setTextColor(100);
		doc.text(300,257,nameStudent,null,null,'center');

		//Seccion del nombre del curso
		doc.setFont("Helvetica");
		doc.setFontType('regular');
		doc.setFontSize(16);
		doc.setTextColor(100);
		doc.text(300,280,`Por haber acreditado con calificación de ${grade} el curso de:`,null,null,'center');

		doc.setFont("Helvetica");
		doc.setFontType('bold');
		doc.setFontSize(16);
		doc.setTextColor(100);
		doc.text(300,299,'"'+course+'"',null,null,'center');

		//Seccion de la calificacion final del estudiante
		// doc.setFont("Helvetica");
		// doc.setFontType('bold');
		// doc.setFontSize(10);
		// doc.setTextColor(100);
		// doc.text(112,167,grade,'center');

		//duracion del curso
		doc.setFont("Helvetica");
		doc.setFontType('regular');
		doc.setFontSize(14);
		doc.setTextColor(100);
		doc.text(300,314,'Con una duración de '+time+' '+units,null,null,'center');


		//fecha de termino del curso por parte del alumno
		doc.setFont("Helvetica");
		doc.setFontType('regular');
		doc.setFontSize(12);
		doc.text(162,370,'Zapopan, Jalisco a '+passDate,null,null,'left');

		// //fecha de termino del curso por parte del alumno
		// doc.setFont("Helvetica");
		// doc.setFontType('regular');
		// doc.setFontSize(12);
		// doc.text(300,440,'El presente documento se puede validar en',null,null,'center');
		//
		// //fecha de termino del curso por parte del alumno
		// doc.setFont("Helvetica");
		// doc.setFontType('bold');
		// doc.setFontSize(12);
		// doc.text(300,450,'https://conalepjalisco.superatemexico.com',null,null,'center');

		const qr = new qrious();
		qr.background = 'white';
		qr.backgroundAlpha = 1;
		qr.foreground = 'black';
		qr.foregroundAlpha = 1;
		qr.level = 'H';
		qr.size = 75;
		qr.value = 'https://conalepjalisco.superatemexico.com/#/pages/certificate';

		doc.addImage(qr.toDataURL('image/jpg'),'jpg',45,252,50,50);

		// let docSave = docName || nameStudent;
		// doc.save(docSave+"-"+course+".pdf");
		window.open(doc.output('bloburl'), '_blank');
	}

	printParticipation(
		document:string,
		certificateNumber:string,
		nameStudent:string,
		course:string,
		time:string,
		units:string,
		passDate:string,
		// docName: string
	){
		var doc = new jsPDF();
		doc.addImage(document,'jpg',0,0,210,300);

		//Seccion de los folios
		doc.setFont("Helvetica");
		doc.setFontSize(12);
		doc.setTextColor(255,0,0);
		doc.text(5,265,"Folio "+certificateNumber,null,null);

		// Seccion del nombre del alumno
		doc.setFont("Helvetica");
		doc.setFontType('bold');
		doc.setFontSize(25);
		doc.setTextColor(100);
		doc.text(100,150,nameStudent,null,null,'center');

		//Seccion del nombre del curso
		doc.setFont("Helvetica");
		doc.setFontType('bold');
		doc.setFontSize(16);
		doc.setTextColor(100);
		doc.text(100,177,'"'+course+'"',null,null,'center');

		//duracion del curso
		doc.setFont("Helvetica");
		doc.setFontType('regular');
		doc.setFontSize(12);
		doc.setTextColor(100);
		doc.text(112,185,''+time+' '+units);


		//fecha de termino del curso por parte del alumno
		doc.setFont("Helvetica");
		doc.setFontType('regular');
		doc.setFontSize(11);
		doc.text(125,202,passDate,null,null,'center');

		// let docSave = docName || nameStudent;
		// doc.save(docSave+"-"+course+".pdf");
		window.open(doc.output('bloburl'), '_blank');
	}
}
