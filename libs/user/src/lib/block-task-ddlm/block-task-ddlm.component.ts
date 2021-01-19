import { Component,
	OnInit,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import {
	CdkDragDrop,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';

import {
	Task,
	SendTask,
	CommonService,
} from '@mat-libreta/shared';

@Component({
  selector: 'mat-libreta-block-task-ddlm',
  templateUrl: './block-task-ddlm.component.html',
  styleUrls: ['./block-task-ddlm.component.scss']
})
export class BlockTaskDdlmComponent implements OnInit {

	@Input() task:Task;
	@Output() sendTask = new EventEmitter<SendTask>();

	arrayLeft		: string[] = [];
	arrayMiddle : string[] = [];
	oriArrayMiddle: string[] = [];

	bgLeftLg		= '';
	bgMiddleLg	= '';
	bgLeftMd		= '';
	bgMiddleMd	= '';
	bgLeftSm		= '';
	bgMiddleSm	= '';

	colorLeftLg		= '';
	colorMiddleLg = '';
	colorLeftMd		= '';
	colorMiddleMd = '';
	colorLeftSm		= '';
	colorMiddleSm = '';

	// orientation = 'vertical';

  constructor(
		private commonService: CommonService
	) {
		// if(this.commonService.isLandscape()) this.orientation = 'horizontal';
	}

	ngOnInit(): void {
		this.commonService.displayLog('tarea ddlm', this.task);
		this.setFields();
	}

	setFields() {
		if(this.task.array1 && this.task.array1.length > 0)
		this.arrayMiddle = [...this.task.array1];
		this.oriArrayMiddle = [...this.task.array1];
		const style = this.task.style;
		if(style) {
			this.bgLeftLg		= style.bgLg?.left;
			this.bgMiddleLg	= style.bgLg?.middle1;
			this.bgLeftMd		= style.bgMd?.left || this.bgLeftLg;
			this.bgMiddleMd	= style.bgMd?.middle1 || this.bgMiddleLg;
			this.bgLeftSm		= style.bgSm?.left || this.bgLeftLg;
			this.bgMiddleSm	= style.bgSm?.middle1 || this.bgMiddleLg;
			this.colorLeftLg		= style.colorLg?.left;
			this.colorMiddleLg	= style.colorLg?.middle1;
			this.colorLeftMd		= style.colorMd?.left || this.colorLeftLg;
			this.colorMiddleMd	= style.colorMd?.middle1 || this.colorMiddleLg;
			this.colorLeftSm		= style.colorSm?.left || this.colorLeftLg;
			this.colorMiddleSm	= style.colorSm?.middle1 || this.colorMiddleLg;
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

		let send_content = {
			content: JSON.stringify(this.arrayLeft),
			type: this.task.type,
			id: this.task.id,
			label: this.task.label,
			text: this.task.text
		};
		this.sendTask.emit(send_content);
	}

}
