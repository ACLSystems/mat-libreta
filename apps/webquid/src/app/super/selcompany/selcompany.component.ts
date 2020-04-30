import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

interface View {
  value: String;
  viewValue: String;
}

import { SuperService } from '../services/super.services';

@Component({
  selector: 'webquid-super-selcompany',
  templateUrl: './selcompany.component.html',
  styleUrls: ['./selcompany.component.scss']
})
export class SelcompanyComponent implements OnInit {

	companies: View[] = [];

  constructor(
		public dialogRef: MatDialogRef<SelcompanyComponent>,
		private router: Router,
		private superService: SuperService
	) {

	}

  ngOnInit(): void {
		let dataCompanies = this.superService.getIdentity().companies;
		console.log(dataCompanies);
		dataCompanies = dataCompanies.filter(company => company.isActive);
		let viewCompanies = dataCompanies.map(company => {
			return {
				value: company.company._id,
				viewValue: company.company.display || company.company.name
			}
		});
		this.companies = [...viewCompanies];
  }

	goToUsers(companyid) {
		this.router.navigate(['/super',companyid]);
		this.dialogRef.close();
	}

}
