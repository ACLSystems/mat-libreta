import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Question, Answer } from '@cetecshared/types/block.type';

@Component({
	selector: 'app-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

	@Input() selectedValue: string;
	@Input() questionNumber: number;
	@Input() question: Question;
	answers: Answer[];
	groupList: any[];

	constructor() { }

	ngOnInit() {
		this.answers = this.question.answers;
		this.groupList = this.question.answers[0].group;
		// console.log(this.groupList);
		this.shuffle();
		// console.log(this.groupList);
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.groupList, event.previousIndex, event.currentIndex);
		console.log(this.groupList);
	}

	private shuffle() {
		for(let i=this.groupList.length -1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i+1));
			[this.groupList[i], this.groupList[j]] = [this.groupList[j], this.groupList[i]];
		}
	}

}
