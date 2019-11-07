import { Component, OnInit, Input } from '@angular/core';

import { Question, Result, Response, Option } from '@cjashared/types/block.type';

import { QuestionService } from '@cjashared/services/question.service';

@Component({
	selector: 'app-group',
	templateUrl: './group.component.html',
	styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

	@Input() selectedValue: string;
	@Input() questionNumber: number;
	@Input() question: Question;
	results: Result[]=[];
	response: Response;

	constructor(
		private questionService: QuestionService
	) { }

	ngOnInit() {
		// console.log('groupComponent')
		// console.log(this.question);
		this.results = Array(this.question.group.length);
	}

	getUserResponse(userResponse:string | string [], idquestion: number) {
		let answers = Array(this.question.group.length);
		if(this.question.answers &&
			this.question.answers.length === 1 &&
			this.question.answers[0].type == 'group') {
				answers = JSON.parse(JSON.stringify(this.question.answers[0].group));
			}
		// console.log(answers)
		let answerExists = null;
		let answer = this.cleanString(answers[idquestion]);
		userResponse = this.cleanString(userResponse);
		if(Array.isArray(answer)) {
			answerExists = answer.find(opt => opt === userResponse);
		}
		this.results[idquestion] = {
			answer: answer,
			answerString: answer,
			response: userResponse,
			responseString: userResponse,
			type: this.question.type,
			index: idquestion,
			indexquestion: this.questionNumber,
			result: (answer === userResponse || answerExists) ? true : false,
			points: (answer === userResponse || answerExists) ? this.question.w : 0
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

	cleanString(string: string | string[]) {
		if(Array.isArray(string)) {
			string.forEach(s => {
				s.replace(/[\'|\`|\‵|\´|\’]/g, '\'');
			});
		} else {
			string.replace(/[\'|\`|\‵|\´|\’]/g, '\'');
		}
		return string;
	}

}
