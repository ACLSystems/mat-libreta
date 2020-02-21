import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UserCourseService } from '@mat-libreta/shared';

export interface Resource {
	content: string,
	title: string
}

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
	providers: [
		UserCourseService
	]
})
export class SupportComponent implements OnInit {

	loading: boolean;
	rosterType: string;
	id: string;
	resources: Resource[] = [];
	myGroup: any;

  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userCourseService: UserCourseService
	) {
		this.activatedRoute.params.subscribe(params => {
				this.rosterType = params.rostertype;
				this.id = params.id;
			}
		);
		this.loading = true;
	}

  ngOnInit() {
		this.loading = true;
		this.userCourseService.myGroup(this.id, this.rosterType).subscribe(group => {
			if(group && group.message) {
				this.myGroup = group.message;
				// console.log(this.myGroup);
				this.userCourseService.getResources(this.rosterType, this.id).subscribe(data => {
					// console.log(data)
					if(data && data.message && data.message.length > 0 && Array.isArray(data.message)) {
						this.resources = data.message;
						// console.log(this.resources);
					} else {
						this.resources = [];
					}
					this.loading = false;
				}, error => {
					Swal.fire({
						type: 'error',
						title: 'Ocurrió un error',
						text: 'Por favor intenta más tarde'
					});
					console.log(error);
				});
			} else {
				Swal.fire({
					type: 'error',
					title: 'Ocurrió un error',
					text: 'Por favor intenta más tarde'
				});
				console.log(group);
			}
		}, error => {
			Swal.fire({
				type: 'error',
				title: 'Ocurrió un error',
				text: 'Por favor intenta más tarde'
			});
			console.log(error);
		});
  }
}
