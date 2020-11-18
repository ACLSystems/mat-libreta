import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mat-libreta-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	year: string;
  constructor() {
		const now = new Date();
		this.year = now.getFullYear() + '';
	}

  ngOnInit(): void {
  }

}
