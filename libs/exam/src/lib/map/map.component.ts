import { Component, OnInit, Input } from '@angular/core';
// import { Subscription } from 'rxjs';

import { Question, Response, Result, Option } from '@mat-libreta/shared';

import { QuestionService } from '@mat-libreta/shared';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

	@Input() selectedValue: string;
	@Input() questionNumber: number;
	@Input() question: Question;
	results: Result[]=[];
	response: Response;
	// subscription: Subscription;

	constructor(
		private questionService: QuestionService
	) {
		// this.subscription = this.questionService.showResults
		// .subscribe(response => {
		//
		// });
	}

	ngOnInit() {
		// console.log('mapComponent')
		// console.log(this.question);
		this.results = Array(this.question.group.length);
	}

	/*
	-option- es el valor de la opción elegida,
	-optionMapId- es el índice de la opción elegida
	-mapId- es el índice de la pregunta dentro del mapa
	*/
	getUserResponse(option: Option, optionMapId: number, mapId: number) {
		// console.log(option);
		// console.log(optionMapId);
		// console.log(mapId);
		let answers = Array(this.question.options.length);
		if(this.question.answers &&
			this.question.answers.length === 1 &&
			this.question.answers[0].type == 'group') {
				answers = JSON.parse(JSON.stringify(this.question.answers[0].group));
			}
		// console.log(answers)
		this.results[mapId] = {
			answer: answers[mapId],
			answerString: this.question.options[answers[mapId]].value,
			response: optionMapId,
			responseString: option.value,
			type: this.question.type,
			index: optionMapId,
			indexquestion: this.questionNumber,
			result: (optionMapId == answers[mapId]) ? true : false,
			points: (optionMapId == answers[mapId]) ? this.question.w : 0
		}
		this.response = {
			indexquestion: this.question.id,
			result: this.results
		}
		// console.log('En map')
		// console.log(this.response);

		// Avisar que el usuario tiene respuesta a la pregunta
		this.questionService.sendResponse(this.response);
	}

}
