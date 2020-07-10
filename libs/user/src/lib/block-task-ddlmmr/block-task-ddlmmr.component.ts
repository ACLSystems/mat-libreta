import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
	CdkDragDrop,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';

import {
	// UserService,
	// UserCourseService,
	Task,
	// TaskEntry,
	// NotElemService,
	CommonService,
} from '@mat-libreta/shared';

interface SendTask {
	content: string,
	type: string,
	id: string,
	label: string,
	text: string
}

@Component({
	selector: 'mat-libreta-block-task-ddlmmr',
	templateUrl: './block-task-ddlmmr.component.html',
	styleUrls: ['./block-task-ddlmmr.component.scss'],
})
export class BlockTaskDdlmmrComponent implements OnInit {

	@Input() task:Task;
	@Output() sendTask = new EventEmitter<SendTask>();

	arrayLeft		: string[] = [];
	arrayMiddle1: string[] = [];
	arrayMiddle2: string[] = [];
	arrayRight	: string[] = [];

	bgLeftLg		: string;
	bgMiddle1Lg	: string;
	bgMiddle2Lg	: string;
	bgRightLg		: string;
	bgLeftMd		: string;
	bgMiddle1Md	: string;
	bgMiddle2Md	: string;
	bgRightMd		: string;
	bgLeftSm		: string;
	bgMiddle1Sm	: string;
	bgMiddle2Sm	: string;
	bgRightSm		: string;

	colorLeftLg		: string;
	colorMiddle1Lg: string;
	colorMiddle2Lg: string;
	colorRightLg	: string;
	colorLeftMd		: string;
	colorMiddle1Md: string;
	colorMiddle2Md: string;
	colorRightMd	: string;
	colorLeftSm		: string;
	colorMiddle1Sm: string;
	colorMiddle2Sm: string;
	colorRightSm	: string;

	constructor(
		private commonService: CommonService
	) {

	}

	ngOnInit(): void {
		this.commonService.displayLog('tarea dlmmr', this.task);
		this.setFields();
	}

	setFields() {
		this.arrayMiddle1 = [...this.task.array1];
		this.arrayMiddle2 = [...this.task.array2];
		this.bgLeftLg			= this.task.style.bgLg.left;
		this.bgMiddle1Lg	= this.task.style.bgLg.middle1;
		this.bgMiddle2Lg	= this.task.style.bgLg.middle2;
		this.bgRightLg		= this.task.style.bgLg.right;
		this.bgLeftMd			= this.task.style.bgMd?.left		|| this.bgLeftLg;
		this.bgMiddle1Md	= this.task.style.bgMd?.middle1	|| this.bgMiddle1Lg;
		this.bgMiddle2Md	= this.task.style.bgMd?.middle2	|| this.bgMiddle2Lg;
		this.bgRightMd		= this.task.style.bgMd?.right		|| this.bgRightLg;
		this.bgLeftSm			= this.task.style.bgSm?.left		|| this.bgLeftLg;
		this.bgMiddle1Sm	= this.task.style.bgSm?.middle1	|| this.bgMiddle1Lg;
		this.bgMiddle2Sm	= this.task.style.bgSm?.middle2	|| this.bgMiddle2Lg;
		this.bgRightSm		= this.task.style.bgSm?.right		|| this.bgRightLg;
		this.colorLeftLg	= this.task.style.colorLg.left;
		this.colorMiddle1Lg = this.task.style.colorLg.middle1;
		this.colorMiddle2Lg = this.task.style.colorLg.middle2;
		this.colorRightLg	= this.task.style.colorLg.right;
		this.colorLeftMd	= this.task.style.colorMd?.left || this.colorLeftLg;
		this.colorMiddle1Md = this.task.style.colorMd?.middle1 || this.colorMiddle1Lg;
		this.colorMiddle2Md = this.task.style.colorMd?.middle2 || this.colorMiddle2Lg;
		this.colorRightMd	= this.task.style.colorMd?.right || this.colorRightLg;
		this.colorLeftSm	= this.task.style.colorSm?.left || this.colorLeftLg;
		this.colorMiddle1Sm = this.task.style.colorSm?.middle1 || this.colorMiddle1Lg;
		this.colorMiddle2Sm = this.task.style.colorSm?.middle2 || this.colorMiddle2Lg;
		this.colorRightSm	= this.task.style.colorSm?.right || this.colorRightLg;
	}

	dropped(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		}
		// console.log('Arreglos');
		// console.log(this.arrayLeft);
		// console.log(this.arrayMiddle1);
		// console.log(this.arrayMiddle2);
		// console.log(this.arrayRight);
		let send_content = {
			content: JSON.stringify(this.arrayLeft) + '-'+JSON.stringify(this.arrayRight),
			type: this.task.type,
			id: this.task.id,
			label: this.task.label,
			text: this.task.text
		};
		this.sendTask.emit(send_content);
	}
}
