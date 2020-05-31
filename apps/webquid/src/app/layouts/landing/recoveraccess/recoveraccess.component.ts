import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mat-libreta-recoveraccess',
  templateUrl: './recoveraccess.component.html',
  styleUrls: ['./recoveraccess.component.scss']
})
export class RecoveraccessComponent implements OnInit {

	key: string = '';

  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {
		this.activatedRoute.params.subscribe( params => {
			if(params.tokentemp != null) {
				this.key = params.tokentemp;
			}
		});
		console.log(this.key);
	}

  ngOnInit(): void {
  }

}
