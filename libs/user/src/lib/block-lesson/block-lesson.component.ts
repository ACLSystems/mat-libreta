import { Component, OnInit, OnChanges, Input, AfterViewInit, SimpleChanges } from '@angular/core';
import { Block } from '@mat-libreta/shared';

@Component({
	selector: 'app-block-lesson',
	templateUrl: './block-lesson.component.html',
	styleUrls: ['./block-lesson.component.scss'],
})
export class BlockLessonComponent implements OnInit, AfterViewInit, OnChanges {

	@Input() blockData:Block;
	@Input() id: string;
	@Input() rosterType: string;
	@Input() blockid: string;
	// track: number;



	constructor() { }

	ngOnInit() {
		// this.track = this.blockData.track;
		// console.group('blockLesson');
		// console.log(this.blockData);
		// console.groupEnd();
	}

	ngOnChanges(changes: SimpleChanges) {
		this.blockData = (changes.blockData && !changes.blockData.firstChange) ? changes.blockData.currentValue : this.blockData;
		this.id = (changes.id && !changes.id.firstChange) ? changes.id.currentValue : this.id;
		this.rosterType = (changes.rosterType && !changes.rosterType.firstChange) ? changes.rosterType.currentValue : this.rosterType;
		this.blockid = (changes.blockid && !changes.blockid.firstChange) ? changes.blockid.currentValue : this.blockid;
		// console.log('changes');
		// if(changes.blockData) {
			// console.group('blockLesson');
			// console.log(this.blockData);
			// console.groupEnd();
		// }
	}

	ngAfterViewInit() {
		var x = Array.from(document.getElementsByTagName("img"));
		if(x.length > 0) {
			x.forEach(img =>{
				// console.log(img.src);
				if(!img.src.includes('localhost')) {
					// console.log(img.src);
					// console.log(img.id);
					// img.classList.add('bg-primary');
				}
			})
		}
	}

}
