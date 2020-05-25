import { Component, OnInit } from '@angular/core';

import { ExportAsConfig, ExportAsService } from 'ngx-export-as';

import {
	SuperService
} from '@mat-libreta/shared';

interface Data {
	courseName: string,
	number: number
}

@Component({
  selector: 'mat-libreta-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsPublicComponent implements OnInit {

	exportAsConfig: ExportAsConfig = {
		type: 'xlsx',
		elementId: 'publicData'
	}
	today: Date = new Date();
	totalCount: number;
	reportDate: Date;
	platform: string;
	loading: Boolean = false;
	dataTable: Data[] = [];

  constructor(
		private exportAsService: ExportAsService,
		private superService: SuperService
	) { }

  ngOnInit(): void {
		this.loading = true;
		this.getPublicData();
  }

	export() {
		this.exportAsService.save(this.exportAsConfig, `CETEC-${this.today.getFullYear()}-${this.today.getMonth()+1}-${this.today.getDate()}`).subscribe(() => {});
	}

	getPublicData() {
		this.superService.getPublicData().subscribe(data => {
			if(data) {
				// console.log(data);
				this.reportDate = data.firstDate;
				if(data.totalCount || data.totalCount === 0) {
					this.totalCount = data.totalCount;
				}
				if(data.totalByCourse) {
					const labels = data.totalByCourse.labels;
					// const labels2 = data.totalByCourse.labels2;
					const series = data.totalByCourse.series;
					for(var i=0; i< labels.length; i++) {
						this.dataTable.push({
							courseName: labels[i],
							number: series[i]
						});
					}
					// console.log(this.dataTable);
				}
			}
			this.loading = false;
		},
		error => {
			console.log(error);
			this.loading = false;
		})
	}

}