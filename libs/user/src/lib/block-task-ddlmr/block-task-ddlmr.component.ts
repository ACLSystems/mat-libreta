import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'mat-libreta-block-task-ddlmr',
  templateUrl: './block-task-ddlmr.component.html',
  styleUrls: ['./block-task-ddlmr.component.scss']
})
export class BlockTaskDdlmrComponent implements OnInit {

	arrayMiddle = [
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
	'Elegir vacaciones'
	];

	arrayLeft = [];
	arrayRight = [];

  constructor() { }

  ngOnInit(): void {
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
		console.log('Arreglos');
		console.log(this.arrayLeft);
		console.log(this.arrayMiddle);
		console.log(this.arrayRight);
	}

}
