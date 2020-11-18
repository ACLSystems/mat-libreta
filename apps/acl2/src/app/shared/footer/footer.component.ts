import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'acl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	year: string;
  constructor() {
		const now = new Date();
		this.year = now.getFullYear() + '';
	}

  ngOnInit(): void {
  }

}
