import { Injectable} from '@angular/core';
// import { DecimalPipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import * as qrious from 'qrious';

@Injectable()
export class CertService {

	constructor(
		// public decimal:DecimalPipe
	) {}

	printCertificate(
		document:string,
		certificateNumber:string,
		nameStudent: string,
		course: string,
		// finalGrade: string,
		time: string,
		units: string,
		passDate: string,
		// docName: string
	) {
		//let grade:string = this.decimal.transform(finalGrade,'.0-2');
		var doc = new jsPDF({
			orientation: 'l',
			unit: 'px',
			format: [800,619]
		});

		doc.addImage(document,'jpg',0,1,600,464);

		//Seccion de los folios
		doc.setFont("Helvetica");
		doc.setFontSize(12);
		doc.setTextColor(255,0,0);
		doc.text(522,108,"Folio "+certificateNumber,null,null);

		// Seccion del nombre del alumno
		doc.setFont("Helvetica");
		doc.setFontType('bold');
		doc.setFontSize(40);
		doc.setTextColor(100);
		doc.text(380,270,nameStudent,null,null,'center');

		//Seccion del nombre del curso
		doc.setFont("Helvetica");
		doc.setFontType('regular');
		doc.setFontSize(14);
		doc.setTextColor(100);
		doc.text(380,295,'Por su participación en el curso:',null,null,'center');

		doc.setFont("Helvetica");
		doc.setFontType('bold');
		doc.setFontSize(16);
		doc.setTextColor(100);
		doc.text(380,320,'"'+course+'"',null,null,'center');

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
		doc.text(320,341,'Con una duración de '+time+' '+units);


		//fecha de termino del curso por parte del alumno
		doc.setFont("Helvetica");
		doc.setFontType('regular');
		doc.setFontSize(16);
		doc.text(275,385,'Cuernavaca, Morelos a '+passDate,null,null);

		//Registro STyPS
		doc.setFont("Helvetica");
		doc.setFontType('regular');
		doc.setFontSize(12);
		doc.text(300,400,'Registro STyPS: CEM-061012-J33-0013',null,null);

		//fecha de termino del curso por parte del alumno
		doc.setFont("Helvetica");
		doc.setFontType('regular');
		doc.setFontSize(12);
		doc.text(300,440,'El presente documento se puede validar en',null,null);

		//fecha de termino del curso por parte del alumno
		doc.setFont("Helvetica");
		doc.setFontType('bold');
		doc.setFontSize(12);
		doc.text(306,450,'https://cetec.superatemexico.com',null,null);

		const qr = new qrious();
		qr.background = 'white';
		qr.backgroundAlpha = 1;
		qr.foreground = 'black';
		qr.foregroundAlpha = 1;
		qr.level = 'H';
		qr.size = 75;
		qr.value = 'https://cetec.superatemexico.com';

		doc.addImage(qr.toDataURL('image/jpg'),'jpg',515,380,75,75);

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
