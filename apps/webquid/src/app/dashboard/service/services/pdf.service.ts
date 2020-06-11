import { Injectable} from '@angular/core';
import * as jsPDF from 'jspdf';
// import 'jspdf-autotable';
import * as qrious from 'qrious';

import { CommonService } from '@wqshared/services/common.service';

// declare var jsPDF:any;

@Injectable({providedIn: 'root'})
export class PDFService {
	constructor(
		private commonService: CommonService
	) {}

	printPDFNomina12(
		docD: any
	) {
		this.commonService.displayLog('docD',docD);
		var doc = new jsPDF({
			orientation: 'p',
			unit: 'mm',
			format: 'letter'
		});

		const complemento = docD.complemento;
		const nomina12 = complemento.nomina12;
		const receptor = docD.receptor;
		const emisor = docD.emisor;

		doc.setProperties({
			title: `Recibo de nómina UUID: ${complemento.timbreFiscalDigital.uuid}`,
			subject: 'Recibo de nómina',
			author: emisor.nombre,
			keywords: 'recibo cfdi nomina12',
			creator: emisor.nombre
		});

		var text = '';
		var dimensions = {
			w:0,h:0
		};

		// Primer renglón: NOMBRE PAGADORA
		var x = 8;
		var y = 8;
		doc.setFontSize(20);
		doc.text(x,y,emisor.nombre);

		// Segundo renglón: RFC y Registro Patronal
		x = 8;
		y = 12;
		doc.setFontSize(8);
		doc.setFontStyle('bold');
		text = 'RFC:';
		var temp = doc.getTextWidth(text);
		doc.text(x,y, text);
		doc.setFontStyle('normal');
		text = emisor.rfc;
		x += 2 + temp;
		doc.text(x,y, text);
		temp = doc.getTextWidth(text);
		doc.setFontStyle('bold');
		text = 'Registro Patronal:'
		x += temp + 9;
		temp = doc.getTextWidth(text);
		doc.text(x,y,text);
		doc.setFontStyle('normal');
		x += temp + 2;
		text = nomina12.emisor.registroPatronal;
		doc.text(x,y,text);

		// Tercer renglón: Fecha de pago
		x = 8;
		y = 16;
		let fechaPago = new Date(nomina12.fechaPago);
		doc.setFontStyle('bold');
		text = 'Fecha de Pago: ';
		temp = doc.getTextWidth(text);
		doc.text(x,y,text);
		doc.setFontStyle('normal');
		x += 2 + temp;
		doc.text(x,y,dateToString(fechaPago));

		// Rectángulo principal
		doc.setFillColor(224,224,224);
		x = 8;
		y = 19;
		var w = 200;
		var h = 31;
		doc.rect(x,y,w,h,'F');

		// Cuarto renglón: Título (Recibo de nómina) y Periodo de pago
		x = 9;
		y = 24;
		let fechaIni = new Date(nomina12.fechaInicialPago);
		let fechaFin = new Date(nomina12.fechaFinalPago);
		doc.setFontType('bold');
		text = 'Recibo de Nómina';
		doc.text(x,y,text);
		text = 'Periodo de Pago:'
		temp = doc.getTextWidth(text);
		var text2 = `${dateToString(fechaIni)} - ${dateToString(fechaFin)}`
		var temp2 = doc.getTextWidth(text2);
		var temp3 = 207-temp-temp2-2;
		doc.text(temp3,y,text);
		doc.setFontStyle('normal');
		doc.text(temp3+temp+2,y,text2)

		// Segunda fila de rectángulos // Quinto Reglón
		var height = 0;
		var firstRecWid = 0;
		var secondRecWid = 0;
		var thirdRecWid = 0;
		var fourthRecWid = 0;
		const recInit = 9;
		const maxWidth = 198;
		const rightMargin = 207;
		const halfPage = maxWidth / 2;
		var yRec = 28;
		var yText = 32;
		// Primer rectángulo
		text = receptor.nombre;
		dimensions = doc.getTextDimensions(text);
		doc.setFillColor(255,255,255);
		firstRecWid = Math.ceil(dimensions.w)+4;
		height = Math.ceil(dimensions.h)+4;
		doc.rect(recInit,yRec,firstRecWid,height,'FD');
		doc.text(recInit+2,yText,text);
		// Segundo rectángulo
		secondRecWid = halfPage - firstRecWid;
		doc.setFillColor(255,255,255);
		doc.rect(recInit + firstRecWid,yRec,secondRecWid,height,'FD');
		text = 'IMSS: ';
		doc.setFontStyle('bold');
		temp = doc.getTextWidth(text);
		doc.text(recInit+firstRecWid+2,yText,text);
		text = nomina12.receptor.numSeguridadSocial;
		doc.setFontStyle('normal');
		doc.text(recInit+firstRecWid+temp+2,yText,text);
		// Tercer rectángulo
		thirdRecWid = halfPage / 2;
		fourthRecWid = halfPage / 2;
		doc.setFillColor(255,255,255);
		doc.rect(recInit+halfPage,yRec,thirdRecWid,height,'FD');
		text = 'CURP: ';
		doc.setFontStyle('bold');
		temp = doc.getTextWidth(text);
		doc.text(recInit+halfPage+2,yText,text);
		text = nomina12.receptor.curp;
		doc.setFontStyle('normal');
		doc.text(recInit+halfPage+temp+2,yText,text);
		// // Cuarto rectángulo
		doc.setFillColor(255,255,255);
		doc.rect(recInit+halfPage+thirdRecWid,yRec,fourthRecWid,height,'FD');
		text = 'RFC: ';
		doc.setFontStyle('bold');
		temp = doc.getTextWidth(text);
		doc.text(recInit+halfPage+thirdRecWid+2,yText,text);
		text = receptor.rfc;
		doc.setFontStyle('normal');
		doc.text(recInit+halfPage+thirdRecWid+temp+2,yText,text);
		// Tercera fila de rectángulos // sexto renglón
		yRec += height;
		yText += height;
		// Primer rectángulo
		firstRecWid = maxWidth / 3;
		secondRecWid = maxWidth / 3;
		thirdRecWid = maxWidth / 3;
		doc.setFillColor(255,255,255);
		doc.rect(recInit,yRec,firstRecWid,height,'FD');
		text = 'Empleado Número: '
		doc.setFontStyle('bold');
		temp = doc.getTextWidth(text);
		doc.text(recInit+2,yText,text);
		doc.setFontStyle('normal');
		text = nomina12.receptor.numEmpleado;
		doc.text(recInit+temp+2,yText,text);
		// Segundo rectángulo
		doc.setFillColor(255,255,255);
		doc.rect(recInit+firstRecWid,yRec,secondRecWid,height,'FD');
		text = 'Puesto: '
		doc.setFontStyle('bold');
		temp = doc.getTextWidth(text);
		doc.text(recInit+firstRecWid+2,yText,text);
		doc.setFontStyle('normal');
		text = nomina12.receptor.puesto;
		doc.text(recInit+firstRecWid+temp+2,yText,text);
		// Tercer rectángulo
		doc.setFillColor(255,255,255);
		doc.rect(recInit+firstRecWid+secondRecWid,yRec,thirdRecWid,height,'FD');
		text = 'Departamento: '
		doc.setFontStyle('bold');
		temp = doc.getTextWidth(text);
		doc.text(recInit+firstRecWid+secondRecWid+2,yText,text);
		doc.setFontStyle('normal');
		text = nomina12.receptor.departamento;
		doc.text(recInit+firstRecWid+secondRecWid +temp+2,yText,text);

		// Cuarta fila de rectángulos // séptimo renglón
		yRec += height;
		yText += height;
		// Primer rectángulo
		doc.setFillColor(255,255,255);
		doc.rect(recInit,yRec,firstRecWid,height,'FD');
		text = 'Días trabajados pagados: ';
		doc.setFontStyle('bold');
		temp = doc.getTextWidth(text);
		doc.text(recInit+2,yText,text);
		doc.setFontStyle('normal');
		text = nomina12.numDiasPagados;
		doc.text(recInit+temp+2,yText,text);
		// Segundo rectángulo
		doc.setFillColor(255,255,255);
		doc.rect(recInit+firstRecWid,yRec,secondRecWid,height,'FD');
		text = 'Salario Diario Integrado: '
		doc.setFontStyle('bold');
		temp = doc.getTextWidth(text);
		doc.text(recInit+firstRecWid+2,yText,text);
		doc.setFontStyle('normal');
		text = nomina12.receptor.salarioDiarioIntegrado;
		doc.text(recInit+firstRecWid+temp+2,yText,text);
		// Tercer rectángulo
		doc.setFillColor(255,255,255);
		doc.rect(recInit+firstRecWid+secondRecWid,yRec,thirdRecWid,height,'FD');
		text = 'Fecha de Alta: '
		doc.setFontStyle('bold');
		temp = doc.getTextWidth(text);
		doc.text(recInit+firstRecWid+secondRecWid+2,yText,text);
		doc.setFontStyle('normal');
		text = nomina12.receptor.fechaInicioRelLaboral;
		doc.text(recInit+firstRecWid+secondRecWid +temp+2,yText,text);

		// Octavo renglón
		yText += 8;
		y = yText; // 54
		x = rightMargin / 4;
		text = 'PERCEPCIONES';
		doc.setFontStyle('bold');
		doc.text(x,y,text,{align: 'center'});
		x = x * 3;
		text = 'DEDUCCIONES';
		doc.setFontStyle('bold');
		doc.text(x,y,text,{align: 'center'});

		// TABLA PERCEPCIONES
		// HEADER

		x = 10;
		yText += 8; y = yText; // 62
		doc.setFontStyle('bold');
		text = 'Clave';
		doc.text(x,y,text);
		x += 10;
		text = 'Concepto';
		doc.text(x,y,text);
		x += 39.5;
		text = 'Imp Gravado';
		doc.text(x,y,text);
		x += 23;
		text = 'Imp Exento';
		doc.text(x,y,text);

		// PERCEPCIONES DATA
		var percepciones = [];
		if(complemento.nomina12 && complemento.nomina12.percepciones && complemento.nomina12.percepciones.percepcion) {
			percepciones = [...complemento.nomina12.percepciones.percepcion];
		}

		if(complemento.nomina12 && complemento.nomina12.otrosPagos && complemento.nomina12.otrosPagos.otroPago) {
			let otrosTemp = [...complemento.nomina12.otrosPagos.otroPago];
			percepciones = percepciones.concat(otrosTemp.map(otro => {
				return {
					clave: otro.clave,
					concepto: otro.concepto,
					importeExento: otro.importe,
					importeGravado: '0'
				};
			}));
		}

		const totalGravado = percepciones.map(item => +item.importeGravado).reduce((acc,curr) => acc + curr);
		const totalExento = percepciones.map(item => +item.importeExento).reduce((acc,curr) => acc + curr);
		// console.log(totalGravado,totalExento);

		// const percepciones = [
		// 	{
		// 		clave: 'P1000',
		// 		concepto: 'SALARIO',
		// 		importeGravado: '1702.82',
		// 		importeExento: '0'
		// 	},{
		// 		clave: 'P1280',
		// 		concepto: 'PREVISION SOCIAL Y OTRO TEXTO LARGO RARO',
		// 		importeGravado: '0',
		// 		importeExento: '970.29'
		// 	},{
		// 		clave: 'P1050',
		// 		concepto: 'SUBSIDIO AL EMPLEO',
		// 		importeGravado: '0',
		// 		importeExento: '0.1'
		// 	},{
		// 		clave: 'P8001',
		// 		concepto: 'INDEMNIZACION RIESGO LABORAL',
		// 		importeGravado: '0',
		// 		importeExento: '17.03'
		// 	}
		// ]
		console.group('Percepciones');
		console.log(percepciones);
		console.groupEnd();
		y += 8;
		yRec = y-4;
		var stripped = true;
		firstRecWid = (rightMargin / 2)-3.375;
		for(var i=0;i<percepciones.length;i++) {
			x = 10;
			if(stripped) {
				doc.setFillColor(224,224,224);
				doc.rect(recInit,yRec,firstRecWid-5,height,'F');
			}
			stripped = !stripped;
			text = percepciones[i].clave;
			doc.setFontStyle('bold');
			doc.text(x,y,text);
			doc.setFontStyle('normal');
			x += 10;
			text = percepciones[i].concepto;
			let lines = doc.splitTextToSize(text,39.5);
			// console.log(lines);
			doc.text(x,y,lines);
			x += 39.5;
			text = numberToString(percepciones[i].importeGravado);
			doc.text(x,y,text);
			x += 23;
			text = numberToString(percepciones[i].importeExento);
			doc.text(x,y,text);
			y += 8;
			yRec += height+1;
		}

		// Totales PERCEPCIONES
		doc.setFillColor('black');
		yRec += height+2;
		var percepLine = yRec;

		// TABLA DEDUCCIONES
		// HEADER

		x = 114;
		yText = 62; y = yText;
		doc.setFontStyle('bold');
		text = 'Clave';
		doc.text(x,y,text);
		x += 10;
		text = 'Concepto';
		doc.text(x,y,text);
		x += 53;
		text = 'Impuestos';
		doc.text(x,y,text);

		// DEDUCCIONES DATA
		const deducciones = complemento.nomina12.deducciones.deduccion;
		// const deducciones = [
		// 	{
		// 		clave: 'D1000',
		// 		concepto: 'ISR RETENIDO SALARIO',
		// 		importe: '77.12'
		// 	},{
		// 		clave: 'D1010',
		// 		concepto: 'IMSS OBRERO TOTAL',
		// 		importe: '42.27'
		// 	},{
		// 		clave: 'D2717',
		// 		concepto: 'CONSUMO ALIMENTOS',
		// 		importe: '120'
		// 	}
		// ]
		y += 8;
		yRec = y-4;
		stripped = true;
		firstRecWid = (rightMargin / 2)-3.375;
		for(var i=0;i<deducciones.length;i++) {
			x = 112;
			if(stripped) {
				doc.setFillColor(224,224,224);
				doc.rect(x,yRec,firstRecWid-5,height,'F');
			}
			x += 2;
			stripped = !stripped;
			text = deducciones[i].clave;
			doc.setFontStyle('bold');
			doc.text(x,y,text);
			doc.setFontStyle('normal');
			x += 10;
			text = deducciones[i].concepto;
			let lines = doc.splitTextToSize(text,39.5);
			// console.log(lines);
			doc.text(x,y,lines);
			x += 53;
			text = numberToString(deducciones[i].importe);
			doc.text(x,y,text);
			y += 8;
			yRec += height+1;
		}

		// Totales DEDUCCIONES
		doc.setFillColor('black');
		yRec += height+2;
		var deducLine = yRec;

		if(percepLine > deducLine) {
			deducLine = percepLine;
		} else {
			percepLine = deducLine;
		}
		// console.log(percepLine,deducLine);
		// console.log(y,yRec);

		doc.line(recInit,percepLine,104,percepLine);
		y = percepLine + 4;
		x = 59.5;
		doc.setFontType('bold');
		text = 'Total Gravado';
		doc.text(x,y,text);
		x += 23;
		text = 'Total Exento';
		doc.text(x,y,text);
		y += 6;
		x = 59.5;
		doc.setFontStyle('normal');
		text = numberToString(totalGravado);
		doc.text(x,y,text);
		x += 23;
		text = numberToString(totalExento);
		doc.text(x,y,text);

		doc.line(112,deducLine,207,deducLine);
		y = deducLine + 4;
		x = 124;
		doc.setFontType('bold');
		text = 'Total Otras Deducciones';
		doc.text(x,y,text);
		x += 53;
		text = 'Total Impuestos';
		doc.text(x,y,text);
		y += 6;
		x = 124;
		doc.setFontStyle('normal');
		text = numberToString(nomina12.deducciones.totalOtrasDeducciones);
		doc.text(x,y,text);
		x += 53;
		text = numberToString(nomina12.deducciones.totalImpuestosRetenidos) || '0.00';
		doc.text(x,y,text);


		// HORAS EXTRAS E INCAPACIDAD
		y += 12;
		x = rightMargin / 4;
		text = 'HORAS EXTRAS';
		doc.setFontStyle('bold');
		doc.text(x,y,text,{align: 'center'});
		x = x * 3;
		text = 'INCAPACIDAD';
		doc.setFontStyle('bold');
		doc.text(x,y,text,{align: 'center'});

		// TABLA HORAS EXTRA
		// HEADER

		x = 10;
		y += 8;
		doc.setFontStyle('bold');
		text = 'Días';
		doc.text(x,y,text);
		x += 10;
		text = 'Tipo';
		doc.text(x,y,text);
		x += 39.5;
		text = 'Horas';
		doc.text(x,y,text);
		x += 23;
		text = 'Imp Pagado';
		doc.text(x,y,text);

		// PONER DATOS HORAS EXTRA


		// TABLA INCAPACIDAD
		// HEADER

		x = 114;
		// yText = 62; y = yText;
		doc.setFontStyle('bold');
		text = 'Días';
		doc.text(x,y,text);
		x += 10;
		text = 'Tipo';
		doc.text(x,y,text);
		x += 53;
		text = 'Importe';
		doc.text(x,y,text);

		// PONER DATOS INCAPACIDAD

		// y += 8;

		// Barra de Totales

		y += 8; yRec = y;
		doc.setFillColor(0,0,0);
		doc.line(recInit,y,207,y);
		doc.setFillColor(224,224,224);
		doc.rect(recInit,y,198,height,'F');
		doc.setFontStyle('bold');
		x = 40; y += 4;
		text = 'Total';
		doc.text(x,y,text);
		x += 99;
		text = 'Total con letra';
		doc.text(x,y,text);
		x = 40; y += 8;
		text = numberToString(docD.total);
		doc.text(x,y,text);
		x += 90;
		text = numberToSpanish(docD.total);
		let lines = doc.splitTextToSize(text,100);
		doc.text(x,y,lines);

		// Subcontratación

		y += 16;
		if(nomina12.receptor.subContratacion.rfcLabora) {
			x = 10;
			doc.setFontStyle('bold');
			text = 'Subcontratación';
			doc.text(x,y,text);
			x = 8;
			doc.setFillColor(224,224,224);
			y += 1;
			doc.line(recInit,y,207,y);
			y += 5; x = 10;
			text = 'RFC cliente: ';
			temp = doc.getTextWidth(text);
			doc.text(x,y,text);
			text = nomina12.receptor.subContratacion.rfcLabora;
			doc.setFontStyle('normal');
			doc.text(x+temp+2,y,text);
			x = 114;
			doc.setFontStyle('bold');
			text = 'Porcentaje: ';
			temp = doc.getTextWidth(text);
			doc.text(x,y,text);
			text = nomina12.receptor.subContratacion.porcentajeTiempo;
			doc.setFontStyle('normal');
			doc.text(x+temp+2,y,text);
		}

		y += 8;
		x = 10;
		doc.setFontStyle('bold');
		text = 'Adenda';
		doc.text(x,y,text);
		x = 8;
		doc.setFillColor(224,224,224);
		y += 1;
		doc.line(recInit,y,207,y);
		y += 2; x = 10;

		const link = `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${complemento.timbreFiscalDigital.uuid}&re=${emisor.rfc}&rr=${receptor.rfc}&tt=${docD.total}&fe=SUPTVA==`;

		const qr = new qrious();
		qr.background = 'white';
		qr.backgroundAlpha = 1;
		qr.foreground = 'black';
		qr.foregroundAlpha = 1;
		qr.level = 'H';
		qr.size = 69;
		qr.padding = 0;
		qr.value = link;

		doc.addImage(qr.toDataURL('image/png'),'png',x,y,38,38);


		// FINALIZAR
		doc.save('test.pdf');
	}
}

// function hoursMeridian(date: Date):string {
// 	let hours = date.getHours();
// 	let minutes = (date.getMinutes()+'').padStart(2,'0');
// 	let meridian = (hours < 12) ? 'AM' : 'PM'
// 	if(hours === 0) {
// 		hours = 12;
// 	}
// 	return `${(hours + '').padStart(2,'0')}:${minutes} ${meridian}`;
// }

function dateToString(date: Date, short: boolean = true, upper: boolean = true):string {
	const monthsShortUp = [
		'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
		'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'
	];
	const monthsLongUp = [
		'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
		'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
	];
	const fullYear: number = date.getFullYear();
	const month: number = date.getMonth();
	const day: number = date.getDate();
	var hours: number = date.getHours();
	const minutes: number = date.getMinutes();
	const meridian: string = (hours < 12) ? 'AM': 'PM';

	if(hours === 0) {
		hours = 12;
	}

	return (short && upper) ?
	`${monthsShortUp[month]} ${day}, ${fullYear} ${(hours+'').padStart(2,'0')}:${(minutes+'').padStart(2,'0')} ${meridian}`:
	(!short && upper) ?
	`${monthsLongUp[month]} ${day}, ${fullYear} ${(hours+'').padStart(2,'0')}:${(minutes+'').padStart(2,'0')} ${meridian}` :
	(short && !upper) ?
	(`${monthsShortUp[month]} ${day}, ${fullYear} ${(hours+'').padStart(2,'0')}:${(minutes+'').padStart(2,'0')} ${meridian}`).toLowerCase():
	(`${monthsLongUp[month]} ${day}, ${fullYear} ${(hours+'').padStart(2,'0')}:${(minutes+'').padStart(2,'0')} ${meridian}`).toLowerCase();

}

function numberToString(number) {
	if(!number) return null;
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberToSpanish(number): string {

		function teens(x) {
			// console.log('teens: ', x);
			const units = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho', 'diecinueve'];
			return units[x];
		}

		function decimes(x) {
			// console.log('decimes: ', x);
			if(x < 20) {
				return teens(x);
			}
			const decimesConst = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
			const decimesUnits = ['', 'diez', 'veinti', 'treinta y ', 'cuarenta y ', 'cincuenta y ', 'sesenta y ', 'setenta y ', 'ochenta y ', 'noventa y '];
			var times = Math.floor(x / 10);
			var mod = x % (times*10);
			// console.log('Times: ', times);
			// console.log('Mod: ', mod)
			if (mod > 0) {
				return decimesUnits[times] + teens(mod);
			} else {
				return decimesConst[times]
			}
		}

		function hundreds(x) {
			// console.log('hundreds: ', x);
			const hundreds = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
			if(x < 100) {
				return decimes(x);
			}
			if(x === 100) {
				return 'cien'
			}
			if(x < 200) {
				return 'ciento ' + decimes(x - 100);
			} else {
				const times = Math.floor(x / 100);
				const mod = x % 100;
				// console.log('Times: ', times);
				// console.log('Mod: ', mod)
				if(mod === 0) {
					return hundreds[times]
				} else {
					var value = x - (times * 100);
					// console.log('Value: ', value)
					return hundreds[times] + ' ' + decimes(value);
				}
			}

		}

		function thousands(x) {
			// console.log('thousands: ', x);
			const thousand = 'mil';
			const thousandsConst = 'miles';
			const times = Math.floor(x/1000);
			const mod = x % 1000;
			// console.log('Times: ', times);
			// console.log('Mod: ', mod)
			if(times < 1) {
				return hundreds(x);
			}
			var word = '';
			if(times > 999) {
				word = millions(times * 1000);
				// console.log('Esto es word en miles: '+word)
			}
			if(times === 1) {
				word = word + ' ' + thousand;
			}
			if (times > 1 ){
				if(times > 999) {
					word = word;
				} else {
					word = word + ' ' + hundreds(times) + ' ' + thousand;
				}
				// console.log('Aquí andamos');
			}
			if(mod > 0) {
				// console.log('Word: ' + word);
				word = word + ' ' + hundreds(mod);
			}


			return word;
		}

		function millions(x) {
			// console.log('millions: ', x);
			const times = Math.floor(x / 1000000);
			const mod = x % 1000000;
			if(times < 1) {
				return thousands(x);
			}
			// console.log('Times: ', times);
			// console.log('Mod: ', mod)
			const million = 'millón';
			const millionPlural = 'millones';
			let word = '';
			if(times === 1) {
				word = `un ${million}`;
			}
			if (times > 1) {
				// console.log('Desde aquí disparamos');
				word = `${thousands(times)} ${millionPlural}`;
			}
			// console.log('Word: ' + word);
			if(mod > 0) {
				word = `${word} ${thousands(mod)}`;
			} else {
				word = word + ' de';
			}
			return word;
		}

		var word = '';

		var numberFloat = +number;
		number = Math.floor(+numberFloat);
		var cents = Math.round((numberFloat - number) * 100);

		if(number === 0) {
			return ('cero pesos (00/100) mn').toUpperCase();
		}

		// esto es un shortcut para llegar rápido a la función correcta
		// Pero si es más de 999999 quiere decir que va a pasar por
		// todas las funciones
		if(number > 999999) {
			word = millions(number);
		} else if (number > 999) {
			word = thousands(number);
		} else if (number > 99) {
			word = hundreds(number);
		} else if (number > 19) {
			word = decimes(number);
		} else {
			word = teens(number);
		}

		if(number === 1) {
			word = word + ' peso';
		} else {
			word = word + ' pesos';
		}


		if(cents > 0 && cents < 10) {
			return `${word} (0${cents}/100) mn` ;
		}
		if(cents > 9) {
			return `${word} (${cents}/100) mn` ;
		}
		if(cents === 0) {
			return `${word} (00/100) mn` ;
		}


}
