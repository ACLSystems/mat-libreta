import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Block } from '@cjashared/types/block.type';

@Component({
	selector: 'app-block-lesson',
	templateUrl: './block-lesson.component.html',
	styleUrls: ['./block-lesson.component.scss'],
})
export class BlockLessonComponent implements OnInit, AfterViewInit {

	@Input() blockData:Block;
	@Input() groupid: string;
	@Input() blockid: string;
	// track: number;

	constructor() { }

	ngOnInit() {
		// this.track = this.blockData.track;
		// console.log('blockLesson');
		// console.log(this.blockData);
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
