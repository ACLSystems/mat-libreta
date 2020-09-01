import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'acl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

	year: string;

  constructor() {
		this.year = new Date().getFullYear().toString();
	}

  ngOnInit(): void {
  }

}
