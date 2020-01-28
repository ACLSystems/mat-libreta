import { Component, OnInit, Input } from '@angular/core';

import { Block, Questionnarie, Question } from '@mat-libreta/shared';

@Component({
	selector: 'app-exam',
	templateUrl: './exam.component.html',
	styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

	loading: boolean;
	@Input() blockData: Block;
	today: Date;
	questionNumber: number;
	question: Question;
	questionnarie: Questionnarie;
	nextButton: boolean;
	prevButton: boolean;
	selectedValue: string;

	constructor() {
		this.today = new Date();
	}

	ngOnInit() {
		this.loading = true;
		this.initQuestions();
	}

	initQuestions() {
		this.questionNumber = 0;
		this.questionnarie = this.blockData.questionnarie;
		this.question = this.questionnarie.questions[this.questionNumber];
		this.checkButtons();
		console.log(this.question);
	}

	nextQuestion() {
		console.log(this.selectedValue);
		this.questionNumber++;
		this.question = this.questionnarie.questions[this.questionNumber];
		this.checkButtons();
		this.selectedValue = undefined;
		console.log(this.question);
	}

	prevQuestion() {
		this.questionNumber--;
		this.question = this.questionnarie.questions[this.questionNumber];
		this.checkButtons();
		this.selectedValue = undefined;
		console.log(this.question);
	}

	checkButtons() {
		if(this.questionnarie.questions[this.questionNumber+1]) {
			this.nextButton = true;
		} else {
			this.nextButton = false;
		}
		if(this.questionnarie.questions[this.questionNumber-1]) {
			this.prevButton = true;
		} else {
			this.prevButton = false;
		}
	}

	getAnswer(
			questionid: string,
			optionid: string,
			questionType: string,
			mapId: string,
			questionNumber: number) {

	}

}
