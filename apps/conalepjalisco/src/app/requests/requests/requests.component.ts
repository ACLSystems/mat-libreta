import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { RequestService } from '../services/requests.service';
import { CommonService, DtOptions } from '@mat-libreta/shared';

@Component({
  selector: 'mat-libreta-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

	loading: boolean = false;
	groups: any[] = [];
	dataTable: any[] = [];
	dtOptions = DtOptions;
	tableHeader: string[];
	exportAsConfig: ExportAsConfig = {
		type: 'xlsx',
		elementId: 'allGroups'
	}
	formGroups = this.fb.group({
		closedGroups: [false]
	});

	get closedGroups() {
		return this.formGroups.get('closedGroups');
	}

  constructor(
		private router: Router,
		private requestService: RequestService,
		private commonService: CommonService,
		private fb: FormBuilder,
		private exportAsService: ExportAsService
	) {
		this.tableHeader = [
			'Plantel',
			'Grupo',
			'Curso',
			'Status',
			'Tipo',
			'Fecha de inicio',
			'Fecha de fin',
			'Instructor',
			'Participantes'
		];
	}

  ngOnInit(): void {
		this.getGroups();
  }

	goToNew() {
		this.router.navigate(['/requests/new']);
	}

	getGroups() {
		const status = this.closedGroups.value ? 'all' : null;
		this.loading = true;
		this.requestService.getAllGroups(status).subscribe((data:any) => {
			this.groups = [...data];
			this.loading = false;
			// console.log(this.groups);
		}, error => {
			console.log(error);
			this.loading = false;
		});
	}

	getAllGroups() {
		// console.log('incluye los grupos cerrados');
		this.getGroups();
	}

	export() {
		const today = new Date();
		this.exportAsService.save(this.exportAsConfig, `Grupos-${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`).subscribe(() => {});
	}

	goToGroup(groupid:string) {
		this.router.navigate(['/requests/group',groupid]);
	}


}
