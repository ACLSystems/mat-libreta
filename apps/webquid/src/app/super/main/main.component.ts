import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { SelcompanyComponent } from '../selcompany/selcompany.component';

@Component({
  selector: 'mat-libreta-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	loading: boolean = false;

  constructor(
		public matDialog: MatDialog
	) { }

  ngOnInit(): void {
  }

	openUserModal(id:string) {
		const userModalDialog = this.matDialog.open(SelcompanyComponent, {
			// disableClose: false,
			id: 'SelectCompany',
			height: '250px',
			width: '400px'
		});
	}

}
