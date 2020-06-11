import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

import { ConfigService } from '../services/config.services';

@Component({
	selector: 'mat-libreta-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	config: any;
	loading: boolean = false;
	configForm = this.fb.group({
		serverIssuer: [''],
		serverExpires: [''],
		serverUrlLogin: [''],
		serverPortalUri: [''],
		routesJsonBodyLimit: [''],
		portalVersion: ['']
	});

	constructor(
		private service: ConfigService,
		private fb: FormBuilder,
		private router: Router
	) { }

	ngOnInit(): void {
		this.loading = true;
		this.service.getConfig().subscribe(data => {
			this.loading = false;
			this.config = data;
			// console.log(this.config);
			let server = data.server;
			let routes = data.routes;
			this.configForm.setValue({
				serverIssuer: server.issuer,
				serverExpires: server.expires,
				serverUrlLogin: server.urlLogin,
				serverPortalUri: server.portalUri,
				routesJsonBodyLimit: routes.jsonBodyLimit,
				portalVersion: data.portalVersion
			});
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				text: `Hubo un error en la obtención de configuración: ${error.message}`
			});
		});
	}

	submit(){
		var submitValues:any = {};
		let changes = false;
		Object.keys(this.configForm.controls).forEach(key => {
			if(!this.configForm.controls[key].pristine) {
				let control = this.configForm.get(key).value;
				if(key.includes('server')) {
					if(!Object.keys(submitValues).includes('server')) {
						submitValues.server = {};
					}
					submitValues.server[setNewKey(key,'server')] = control;
				}
				if(key.includes('routes')) {
					if(!Object.keys(submitValues).includes('routes')) {
						submitValues.routes = {};
					}
					submitValues.routes[setNewKey(key,'routes')] = control;
				}
				if(key.includes('portalVersion')) {
					submitValues.portalVersion = control;
				}
				changes = true;
			}
		});
		// console.log(this.configForm);
		// console.log(submitValues);
		if(changes) {
			this.service.setConfig(submitValues).subscribe(data => {
				// console.log(data);
				if(data && data.message && data.message.includes('configuración realizada')) {
					Swal.fire({
						type: 'info',
						text: data.message
					});
				} else {
					Swal.fire({
						type: 'warning',
						text: 'El servidor API regresó un mensaje no esperado. Favor de validar directo en el servidor API'
					});
				}
			}, error => {
				console.log(error);
				Swal.fire({
					type: 'error',
					text: `Hubo un error: ${error.message}`
				})
			});
		} else {
			Swal.fire({
				type: 'warning',
				text: 'Nada que guardar'
			});
		}
	}

	goToHome() {
		this.router.navigate(['/services'])
	}

}

function setNewKey(key: string, word:string) {
	let newKey = key.replace(word,'');
	newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);
	// console.log('newKey: ', newKey);
	return newKey;
}
