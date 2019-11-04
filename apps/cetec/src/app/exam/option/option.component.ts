import { Component, OnInit, Input } from '@angular/core';

import { Question, Response, Result, Option } from '@cetecshared/types/block.type';

import { QuestionService } from '@cetecshared/services/question.service';

@Component({
	selector: 'app-option',
	templateUrl: './option.component.html',
	styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {

	@Input() selectedValue: string;
	@Input() questionNumber: number;
	@Input() question: Question;
	results: Result[]=[];
	response: Response;

	constructor(
		private questionService: QuestionService
	) { }

	ngOnInit() {
		this.results = Array(1);
		// console.log(this.question);
	}

	/*
	Aquí solo tomamos selectedValue
	*/
	getUserResponse(selectedValue: string, optionId: number) {
		// console.log(selectedValue);
		// console.log(optionId);
		let question = this.question;
		// let findResponseIndex = question.options.findIndex(opt => opt.value === this.selectedValue);
		// // console.log(findResponseIndex);
		let selectedOption: boolean = false;
		if(question.answers && question.answers.length === 1) {
			if(question.answers[0].index === optionId) {
				selectedOption = true;
			}
		}
		// // console.log(selectedOption);
		// // [0] porque no hay map aquí, es una sola opción
		this.results[0] = {
			answer: question.answers[0].index,
			answerString: this.question.options[question.answers[0].index].value,
			response: optionId,
			responseString: selectedValue,
			type: question.type,
			index: 0,
			indexquestion: this.questionNumber,
			result: selectedOption,
			points: selectedOption ? question.w : 0
		}
		// // console.log(this.results);
		this.response = {
			indexquestion: question.id,
			result: this.results
		}
		this.questionService.sendResponse(this.response);
	}

}
