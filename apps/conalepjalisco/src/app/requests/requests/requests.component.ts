import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mat-libreta-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

	loading: boolean = false;

  constructor(
		private router: Router
	) { }

  ngOnInit(): void {
  }

	goToNew() {
		this.router.navigate(['/requests/new']);
	}

}
