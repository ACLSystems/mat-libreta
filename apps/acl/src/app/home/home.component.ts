import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'acl-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	year: string;

  constructor() {
		this.year = new Date().getFullYear().toString();
	}

  ngOnInit(): void {
  }

}
