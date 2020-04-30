import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OperService } from '../services/oper.services';

@Component({
  selector: 'mat-libreta-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

	companyid: string;
	loading: boolean = false;
	company: any;
	companyMessage: string = '';

  constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) public id: any,
		private operService: OperService,
		public dialogRef: MatDialogRef<CompanyComponent>
	) {
		if(id && id.id) {
			this.companyid = id.id;
		}
	}

  ngOnInit(): void {
		this.loading = true;
		if(this.companyid) {
			this.operService.getCompany(this.companyid).subscribe(data => {
				console.log(data);
				if(data && data.message && data.message.includes('No existen empresas')) {
					this.companyMessage = data.message;
				} else {
					this.company = data.company;
					this.company.isActive = data.isActive;
				}
				this.loading = false;
			}, error => {
				console.log(error);
				this.companyMessage = error.message;
			});
		}
  }

	closeDialog() {
		this.dialogRef.close();
	}

}
