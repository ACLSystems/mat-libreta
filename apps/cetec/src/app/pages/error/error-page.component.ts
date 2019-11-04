import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
	errorMessage: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
		this.route.data.subscribe(
			(data: Data) => {
				if(data && data.message){
					this.errorMessage = data['message'];
					// console.log(data);
				}
			}
		);
  }

}
