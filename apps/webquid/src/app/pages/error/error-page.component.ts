import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

@Component({
  selector: 'webquid-error',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
	errorMessage: string;

  constructor(
		private route: ActivatedRoute,
		private router: Router
	) { }

  ngOnInit() {
		this.route.data.subscribe(
			(data: Data) => {
				if(data && data.message){
					this.errorMessage = data['message'];
					// console.log(data);
				}
			}
		);
		setTimeout(() => {
			this.goHome();
		}, 2601)
  }

	goHome() {
		this.router.navigate(['/pages/home']);
	}

}
