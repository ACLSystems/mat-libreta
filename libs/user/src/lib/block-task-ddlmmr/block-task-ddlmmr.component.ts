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
	SendTask,
	CommonService,
} from '@mat-libreta/shared';

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

	bgLeftLg		= '';
	bgMiddle1Lg	= '';
	bgMiddle2Lg	= '';
	bgRightLg		= '';
	bgLeftMd		= '';
	bgMiddle1Md	= '';
	bgMiddle2Md	= '';
	bgRightMd		= '';
	bgLeftSm		= '';
	bgMiddle1Sm	= '';
	bgMiddle2Sm	= '';
	bgRightSm		= '';

	colorLeftLg		= '';
	colorMiddle1Lg= '';
	colorMiddle2Lg= '';
	colorRightLg	= '';
	colorLeftMd		= '';
	colorMiddle1Md= '';
	colorMiddle2Md= '';
	colorRightMd	= '';
	colorLeftSm		= '';
	colorMiddle1Sm= '';
	colorMiddle2Sm= '';
	colorRightSm	= '';

	constructor(
		private commonService: CommonService
	) {

	}

	ngOnInit(): void {
		this.commonService.displayLog('tarea ddlmmr', this.task);
		this.setFields();
	}

	setFields() {
		if(this.task.array1 && this.task.array1.length > 0)
		this.arrayMiddle1 = [...this.task.array1];
		if(this.task.array2 && this.task.array2.length > 0)
		this.arrayMiddle2 = [...this.task.array2];
		const style = this.task.style;
		if(style) {
			this.bgLeftLg			= style.bgLg?.left;
			this.bgMiddle1Lg	= style.bgLg?.middle1;
			this.bgMiddle2Lg	= style.bgLg?.middle2;
			this.bgRightLg		= style.bgLg?.right;
			this.bgLeftMd			= style.bgMd?.left		|| this.bgLeftLg;
			this.bgMiddle1Md	= style.bgMd?.middle1	|| this.bgMiddle1Lg;
			this.bgMiddle2Md	= style.bgMd?.middle2	|| this.bgMiddle2Lg;
			this.bgRightMd		= style.bgMd?.right		|| this.bgRightLg;
			this.bgLeftSm			= style.bgSm?.left		|| this.bgLeftLg;
			this.bgMiddle1Sm	= style.bgSm?.middle1	|| this.bgMiddle1Lg;
			this.bgMiddle2Sm	= style.bgSm?.middle2	|| this.bgMiddle2Lg;
			this.bgRightSm		= style.bgSm?.right		|| this.bgRightLg;
			this.colorLeftLg	= style.colorLg?.left;
			this.colorMiddle1Lg = style.colorLg?.middle1;
			this.colorMiddle2Lg = style.colorLg?.middle2;
			this.colorRightLg	= style.colorLg?.right;
			this.colorLeftMd	= style.colorMd?.left || this.colorLeftLg;
			this.colorMiddle1Md = style.colorMd?.middle1 || this.colorMiddle1Lg;
			this.colorMiddle2Md = style.colorMd?.middle2 || this.colorMiddle2Lg;
			this.colorRightMd	= style.colorMd?.right || this.colorRightLg;
			this.colorLeftSm	= style.colorSm?.left || this.colorLeftLg;
			this.colorMiddle1Sm = style.colorSm?.middle1 || this.colorMiddle1Lg;
			this.colorMiddle2Sm = style.colorSm?.middle2 || this.colorMiddle2Lg;
			this.colorRightSm	= style.colorSm?.right || this.colorRightLg;
		}
	}

	dropped(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		} else {
			if(this.task.dd === 'one' && event.container.data.length > 0) {
				transferArrayItem(
					event.container.data,
					event.previousContainer.data,
					0,
					event.previousIndex + 1
				);
			}
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
