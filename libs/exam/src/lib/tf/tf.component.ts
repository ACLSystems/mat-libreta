import {
	Component,
	Input,
	OnChanges,
	OnInit
} from '@angular/core';

import {
	Question,
	Result,
	Response
} from '@mat-libreta/shared';

import { QuestionService } from '@mat-libreta/shared';

@Component({
	selector: 'app-tf',
	templateUrl: './tf.component.html',
	styleUrls: ['./tf.component.scss']
})
export class TfComponent implements OnInit, OnChanges {

	@Input() selectedValue: string;
	@Input() questionNumber: number;
	@Input() question: Question;
	results: Result[]=[];
	response: Response;

	constructor(
		private questionService: QuestionService
	) {}

	ngOnInit() {
		// console.group('Question type TF - Init');
		// console.log('Question number: ',this.questionNumber);
		// console.log(this.question);
		// console.log('Selected value: ',this.selectedValue);
		// console.groupEnd();
		this.results[0] = this.setQuestion();
		this.response = {
			indexquestion: this.question.id,
			result: this.results
		}
		setTimeout(() => {
			this.questionService.sendResponse(this.response);
		}, 300);
	}

	ngOnChanges() {
		// console.group('Question type TF - OnChange');
		// console.log('Question number: ',this.questionNumber);
		// console.log(this.question);
		// console.log('Selected value: ',this.selectedValue);
		// console.groupEnd();
		this.selectedValue = '';
		this.getUserResponse();
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
		this.results[0] = this.setQuestion();
		this.response = {
			indexquestion: this.question.id,
			result: this.results
		}
		this.questionService.sendResponse(this.response);
	}

	setQuestion() {
		let selectedOption: boolean = false;
		let question = this.question;
		let questionNumber = this.questionNumber;
		let selectedValue = this.selectedValue || '';
		if(question.answers.length === 1) {
			const valueAnswer = question.answers[0].tf;
			if(this.selectedValue === valueAnswer){
				selectedOption = true;
			}
			if(!this.selectedValue && valueAnswer !== 'true') {
				selectedOption = true;
			}
		}
		const result = {
			answer: (question.answers[0].tf === "true")? true : false,
			answerString: question.answers[0].tf,
			response: (selectedValue === "true") ? true : false,
			responseString: (selectedValue === "true") ? "true" : "false",
			type: question.type,
			index: 0,
			indexquestion: questionNumber,
			result: selectedOption,
			points: selectedOption ? question.w : 0
		};
		// console.log('Result: ',result);
		return result;
	}

}
