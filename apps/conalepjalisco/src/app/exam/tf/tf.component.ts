import { Component, OnInit, Input } from '@angular/core';

import { Question, Result, Response } from '@cjashared/types/block.type';

import { QuestionService } from '@cjashared/services/question.service';

@Component({
	selector: 'app-tf',
	templateUrl: './tf.component.html',
	styleUrls: ['./tf.component.scss']
})
export class TfComponent implements OnInit {

	@Input() selectedValue: string;
	@Input() questionNumber: number;
	@Input() question: Question;
	results: Result[]=[];
	response: Response;

	constructor(
		private questionService: QuestionService
	) { }

	ngOnInit() {
		let question = this.question;
		this.results[0] = {
			answer: (question.answers[0].tf === "true")? true : false,
			answerString: question.answers[0].tf,
			response: false,
			responseString: 'false',
			type: question.type,
			index: 0,
			indexquestion: this.questionNumber,
			result: false,
			points: question.w * 0
		}
		this.response = {
			indexquestion: this.question.id,
			result: this.results
		}
		setTimeout(() => {
			this.questionService.sendResponse(this.response);
		}, 300);
	}

	getUserResponse() {
		/*
			Este toggle no pasa a falso cuando está en verdadero. Visualmente se queda en verdadero, pero en realidad está en falso. Entonces, obligamos a que pase a falso, pasando primero por verdadero.
		*/
		if(!this.selectedValue) {
			this.selectedValue = 'true';
			this.selectedValue = '';
		}
		this.selectedValue = this.selectedValue + '';
		// console.log(this.question)
		// console.log(this.selectedValue);
		// console.log(typeof this.selectedValue)
		let question = this.question;
		let selectedOption: boolean = false;
		if(question.answers.length === 1) {
			if(this.selectedValue === question.answers[0].tf){
				selectedOption = true;
			}
		}

		this.results[0] = {
			answer: (question.answers[0].tf === "true")? true : false,
			answerString: question.answers[0].tf,
			response: (this.selectedValue === "true" && this.selectedValue) ? true : false,
			responseString: this.selectedValue + '',
			type: question.type,
			index: 0,
			indexquestion: this.questionNumber,
			result: selectedOption,
			points: selectedOption ? question.w : 0
		}

		this.response = {
			indexquestion: question.id,
			result: this.results
		}
		this.questionService.sendResponse(this.response);
	}

}
