import { Injectable} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as jsPDF from 'jspdf';

@Injectable()
export class DocsService {

	constructor(
		public decimal:DecimalPipe
	) {}

	printCertificate(
		document:string,
		certificateNumber:string,
		nameStudent: string,
		course: string,
		//finalGrade: any,
		time: string,
		units: string,
		passDate: string,
		docName: string
	) {
		//let grade:string = this.decimal.transform(finalGrade,'.0-2');
    var doc = new jsPDF({
			orientation: 'l',
			unit: 'px',
			format: [800,619]
		});

		doc.addImage(document,'jpg',0,1,600,464);

    //Seccion de los folios
    doc.setFont("Times");
    doc.setFontSize(12);
    doc.setTextColor(255,0,0);
    doc.text(520,450,"Folio "+certificateNumber,null,null);

    // Seccion del nombre del alumno
    doc.setFont("Times");
    doc.setFontType('bold');
    doc.setFontSize(40);
    doc.setTextColor(100);
    doc.text(380,270,nameStudent,null,null,'center');

    //Seccion del nombre del curso
    doc.setFont("Times");
    doc.setFontType('bold');
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text(380,325,'"'+course+'"',null,null,'center');

    //Seccion de la calificacion final del estudiante
    // doc.setFont("Times");
    // doc.setFontType('bold');
    // doc.setFontSize(10);
    // doc.setTextColor(100);
    // doc.text(112,167,grade,'center');

    //duracion del curso
    doc.setFont("Times");
    doc.setFontType('regular');
    doc.setFontSize(18);
    doc.setTextColor(100);
    doc.text(430,341,''+time+' '+units);


    //fecha de termino del curso por parte del alumno
    doc.setFont("Times");
    doc.setFontType('regular');
    doc.setFontSize(18);
    doc.text(400,385,passDate,null,null);

		let docSave = docName || nameStudent;
    doc.save(docSave+"-"+course+".pdf");
	}

	printParticipation(
		document:string,
		certificateNumber:string,
		nameStudent:string,
		course:string,
		time:string,
		units:string,
		passDate:string,
		docName: string){
    var doc = new jsPDF();
    doc.addImage(document,'jpg',0,0,210,300);

    //Seccion de los folios
    doc.setFont("Times");
    doc.setFontSize(12);
    doc.setTextColor(255,0,0);
    doc.text(5,265,"Folio "+certificateNumber,null,null);

    // Seccion del nombre del alumno
    doc.setFont("Times");
    doc.setFontType('bold');
    doc.setFontSize(25);
    doc.setTextColor(100);
    doc.text(100,150,nameStudent,null,null,'center');

    //Seccion del nombre del curso
    doc.setFont("Times");
    doc.setFontType('bold');
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text(100,177,'"'+course+'"',null,null,'center');

    //duracion del curso
    doc.setFont("Times");
    doc.setFontType('regular');
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(112,185,''+time+' '+units);


    //fecha de termino del curso por parte del alumno
    doc.setFont("Times");
    doc.setFontType('regular');
    doc.setFontSize(11);
    doc.text(125,202,passDate,null,null,'center');

		let docSave = docName || nameStudent;
    doc.save(docSave+"-"+course+".pdf");
  }
}
