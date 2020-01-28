import { Component, OnInit, Input } from '@angular/core';

import { Question } from '@mat-libreta/shared';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {

	@Input() selectedValue: string;
	@Input() questionNumber: number;
	@Input() question: Question;

  constructor() { }

  ngOnInit() {
  }

}
