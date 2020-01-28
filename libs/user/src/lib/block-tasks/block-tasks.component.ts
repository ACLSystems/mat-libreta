import { Component, OnInit, Input } from '@angular/core';

import { Task } from '@mat-libreta/shared';

@Component({
  selector: 'app-block-tasks',
  templateUrl: './block-tasks.component.html',
  styleUrls: ['./block-tasks.component.scss']
})
export class BlockTasksComponent implements OnInit {

	@Input() tasks: Task[];
	textareaValue: string = '';

	currentFileUpload: File;
	progress: {
		percentage: number,
		status: string,
		statusAlert: string,
		icon: string
	} = {
		percentage: 0,
		status: 'Cargando...',
		statusAlert: 'alert-info',
		icon: 'fas fa-info-circle'
	};

	constructor() {}

	ngOnInit() {}

}
