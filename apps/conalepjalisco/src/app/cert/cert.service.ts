import { Injectable} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import * as qrious from 'qrious';

import {
	Drawing,
	DrawingOption
} from './cert.model';

@Injectable()
export class CertService {

	constructor(
		public decimal:DecimalPipe
	) {}

	printCertificate(
		drawing: Drawing,
		document:string,
		certificateNumber:string,
		nameStudent: string,
		course: string,
		finalGrade: string,
		time: string,
		units: string,
		passDate: string,
		directSave?: boolean,
		period?: string
	) {
		let grade:string = this.decimal.transform(finalGrade,'.0-2');
		var doc = new jsPDF({
			orientation: drawing.doc.orientation || 'l',
			unit: drawing.doc.unit || 'px'
			// format: [814,1053]
		});

		const width = doc.internal.pageSize.getWidth();
		const height = doc.internal.pageSize.getHeight();

		doc.addImage(
			document,
			drawing.doc.type||'PNG',
			drawing.doc.x || 0,
			drawing.doc.y || 1,
			width,
			height,
			null,
			'FAST'
		);

		//Seccion de los folios
		// doc.text(499,81,"Folio "+certificateNumber,null,null);
		if(drawing.folio && drawing.folio.enabled) {
			doc = draw(drawing.folio,certificateNumber,doc);
		}

		// A
		// doc.text(300,225,'A',null,null,'center');
		if(drawing.to && drawing.to.enabled) {
			doc = draw(drawing.to,'',doc);
		}

		// Seccion del nombre del alumno
		// doc.text(300,257,nameStudent,null,null,'center');
		if(drawing.studentName && drawing.studentName.enabled) {
			doc = draw(drawing.studentName,nameStudent,doc);
		}

		//Seccion de la calificacion final del estudiante
		// doc.text(300,280,`Por haber acreditado con calificación de ${grade} el curso de:`,null,null,'center');
		if(drawing.grade && drawing.grade.enabled) {
			doc = draw(drawing.grade,grade,doc);
		}

		//Seccion del nombre del curso
		// doc.text(300,299,'"'+course+'"',null,null,'center');
		if(drawing.course && drawing.course.enabled) {
			doc = draw(drawing.course,course,doc);
		}

		//Periodo
		// doc.text(300,299,'"'+course+'"',null,null,'center');
		if(drawing.period && drawing.period.enabled) {
			doc = draw(drawing.period,period,doc);
		}

		//duracion del curso
		// doc.text(300,314,'Con una duración de '+time+' '+units,null,null,'center');
		if(drawing.courseDuration && drawing.courseDuration.enabled) {
			doc = draw(drawing.courseDuration,time+' '+units,doc);
		}

		//fecha de termino del curso por parte del alumno
		// doc.text(162,370,'Zapopan, Jalisco a '+passDate,null,null,'left');
		if(drawing.endDate && drawing.endDate.enabled) {
			doc = draw(drawing.endDate,passDate,doc);
		}

		if(drawing.qr && drawing.qr.enabled) {
			const qr = new qrious();
			qr.background = 'white';
			qr.backgroundAlpha = 1;
			qr.foreground = 'black';
			qr.foregroundAlpha = 1;
			qr.level = 'H';
			qr.size = drawing.qr.size;
			// qr.value = 'https://conalepjalisco.superatemexico.com/#/pages/certificate';
			qr.value = drawing.qr.url;

			doc.addImage(
				qr.toDataURL('image/jpg'),
				'jpg',
				drawing.qr.x,
				drawing.qr.y,
				drawing.qr.w,
				drawing.qr.h
			);
		}



		if(directSave) {
			let docSave = nameStudent;
			doc.save(docSave+"-"+course+".pdf");
		} else {
			window.open(doc.output('bloburl'), '_blank');
		}
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

function draw(item: DrawingOption, dataItem: string, doc: any) {
	doc.setFont(item.font || 'Helvetica');
	doc.setFontType(item.fontType || 'regular');
	doc.setFontSize(item.fontSize);
	if(item.textColor) {
		doc.setTextColor(
			item.textColor.r,
			item.textColor.g,
			item.textColor.b
		);
	}
	if(item.grayColor) {
		doc.setTextColor(item.grayColor);
	}
	// doc.text(499,81,"Folio "+certificateNumber,null,null);
	if(!item.text.pre) item.text.pre = '';
	if(!item.text.post) item.text.post = '';
	doc.text(item.text.xPos,item.text.yPos,item.text.pre + dataItem + item.text.post,null,null,item.text.justify||null);
	return doc;
}
