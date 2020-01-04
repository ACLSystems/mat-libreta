import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';
import Swal from 'sweetalert2';

import { UserService } from '@crmshared/services/user.service';
import { CommonService } from '@crmshared/services/common.service';
import { DtOptions } from '@crmshared/config/config.module';
import { Quote } from '@crmshared/classes/quote.class';

registerLocaleData(localeMX);

@Component({
	selector: 'mat-libreta-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
	providers: [
		{
			provide: LOCALE_ID,
			useValue: 'es-MX'
		}
	]
})
export class ViewQuotesComponent implements OnInit {

	loading: boolean;
	tableHeader: string[];
	dtOptions = DtOptions;
	quotes: Quote[] = [];
	today: Date;

	constructor(
		private userService: UserService,
		private commonService: CommonService,
		private router: Router
	) {
		this.loading = false;
		this.tableHeader = [
			'Número',
			'Estado',
			'Cuenta',
			'Dueño',
			'Valor',
			'Fecha',
			'Válida'
		];
	}

	ngOnInit() {
		this.today = new Date();
		this.loadQuotes();
	}

	loadQuotes() {
		this.loading = true;
		this.userService.getQuoteList().subscribe(data => {
			if(data && Array.isArray(data) && data.length > 0) {
				this.quotes = [];
				data.forEach(q => {
					this.quotes.push(new Quote(q));
				});
				this.quotes = [...data];
				this.commonService.displayLog('Quotes',this.quotes);
			}
			this.loading = false;
		}, error => {
			if(error.status === 404) {
				console.log(error);
				this.loading = false;
				Swal.fire({
					type: 'info',
					text: 'No hay datos disponibles que mostrar'
				});
			} else if(error.status === 0) {
				console.log(error);
				Swal.fire({
					type: 'error',
					title: 'Hubo un error',
					text: 'No hay comunicación con el servidor'
				});
				this.router.navigate(['/']);
			} else {
				console.log(error);
				Swal.fire({
					type: 'error',
					title: 'Hubo un error',
					text: error
				});
			}
		});
	}

	createQuote() {
		this.router.navigate(['/quotes/create']);
	}
}
