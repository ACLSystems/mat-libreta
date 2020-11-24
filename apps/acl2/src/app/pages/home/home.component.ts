import { Component, OnInit } from '@angular/core';
import {
	ActivatedRoute
} from '@angular/router';

@Component({
  selector: 'mat-libreta-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	params: any =[];
	year: string;
  constructor(
		private activatedRoute: ActivatedRoute
	) {
		const now = new Date();
		this.year = now.getFullYear() + '';
		this.activatedRoute.queryParams.subscribe(params => {
			console.log(params);
		});
	}

  ngOnInit(): void {
  }

}
