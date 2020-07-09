import { Component, OnInit, Input } from '@angular/core';
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

@Component({
	selector: 'mat-libreta-block-task-ddlmmr',
	templateUrl: './block-task-ddlmmr.component.html',
	styleUrls: ['./block-task-ddlmmr.component.scss'],
})
export class BlockTaskDdlmmrComponent implements OnInit {

	@Input() task: Task;

	arrayMiddle1 = [
		'Lavar',
		'Planchar',
		'Amamantar',
		'Eyacular',
		'Ovular',
		'Lavar la ropa',
		'Bañar a los niños',
		'Llorar',
		'Proteger',
		'Levantar platos',
		'Cocinar',
		'Hacer las compras',
		'Sostener el hogar',
		'Decidir las escuelas',
		'Pagar los recibos',
		'Elegir vacaciones',
	];

	arrayMiddle2 = [
		'Lavar',
		'Planchar',
		'Amamantar',
		'Eyacular',
		'Ovular',
		'Lavar la ropa',
		'Bañar a los niños',
		'Llorar',
		'Proteger',
		'Levantar platos',
		'Cocinar',
		'Hacer las compras',
		'Sostener el hogar',
		'Decidir las escuelas',
		'Pagar los recibos',
		'Elegir vacaciones',
	];

	arrayLeft = [];
	arrayRight = [];

	bgLeftLg		= 'lightblue url(https://www.dropbox.com/s/ozp0ja5x58o85q0/hombre.png?dl=1) no-repeat left top';
	bgMiddle1Lg	= 'white';
	bgMiddle2Lg	= 'white';
	bgRightLg		= 'deeppink url(https://www.dropbox.com/s/ibs6hc3mbkiunk7/mujer.png?dl=1) no-repeat right top';
	bgLeftMd		= this.bgLeftLg;
	bgMiddle1Md	= this.bgMiddle1Lg;
	bgMiddle2Md	= this.bgMiddle2Lg;
	bgRightMd		= this.bgRightLg;
	bgLeftSm		= 'lightblue';
	bgMiddle1Sm	= this.bgMiddle1Lg;
	bgMiddle2Sm	= this.bgMiddle2Lg;
	bgRightSm		= 'deeppink';

	colorMiddle1 			= 'blue';
	colorMiddle2			= 'red';

	constructor(
		private commonService: CommonService
	) {
		this.commonService.displayLog('tarea dlmmr', this.task);
	}

	ngOnInit(): void {}

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
		console.log('Arreglos');
		console.log(this.arrayLeft);
		console.log(this.arrayMiddle1);
		console.log(this.arrayMiddle2);
		console.log(this.arrayRight);
	}
}
