import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Response } from '../types/block.type';

@Injectable()
export class QuestionService {

	// Observable (tipo resultado)
	private response = new Subject<Response>();
	// Observable para imprimir resultado (bandera tipo boolean)
	private print = new Subject<boolean>();

	// Observable para la respuesta a la pregunta

	getResponse = this.response.asObservable();

	// Observable para dar la indicación de imprimir respuesta
	showResults = this.print.asObservable();

	// Comando para mandar el resultado de la pregunta
	sendResponse(response: Response){
		// console.log('En servicio')
		// console.log(response)
		this.response.next(response);
	}

	printResults(print: boolean) {
		// console.log('En servicio - print')
		this.print.next(print);
	}

}
