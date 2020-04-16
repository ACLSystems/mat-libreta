import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OperService } from '../services/oper.services';

@Component({
  selector: 'mat-libreta-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

	userid: string;
	loading: boolean = false;
	user: any;
	userMessage: string = '';

  constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) public id: any,
		private activatedRoute: ActivatedRoute,
		private operService: OperService,
		public dialogRef: MatDialogRef<UserComponent>
	) {
		// console.group('User modal Constructor')
		// console.log(id);
		// console.groupEnd();
		if(id && id.id) {
			this.userid = id.id;
		}
		// this.activatedRoute.params.subscribe(params => {
		// 	this.id = params.id;
		// });
	}

  ngOnInit(): void {
		this.loading = true;
		if(this.userid) {
			this.operService.getUser(this.userid).subscribe(data => {
				if(data && data.message && data.message.includes('No se encontr')) {
					this.userMessage = data.message;
				} else {
					this.user = data;
				}
				this.loading = false;
			}, error => {
				console.log(error);
				this.userMessage = error.message;
			});
		}
  }

	closeDialog() {
		this.dialogRef.close();
	}

}
