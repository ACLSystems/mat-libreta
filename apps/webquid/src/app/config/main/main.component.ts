import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

declare global {
	interface Window { fcWidget: any; }
}
//
// declare const $:any;

window.fcWidget = window.fcWidget || {};

import { ConfigService } from '../services/config.services';
import { CommonService } from '@wqshared/services/common.service';

type Folder = {
	id: string,
	name: string,
	visibility: number,
	description: string
}

type Category = {
	id: string,
	name: string,
	folders: Folder[]
}

interface Display {
	value: string;
	viewValue: string;
}

interface DisplayGroup {
  disabled?: boolean;
	name: string;
	display: Display[]
}

@Component({
	selector: 'mat-libreta-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	config: any;
	loading: boolean = false;
	configForm = this.fb.group({
		serverIssuer				: [''],
		serverExpires				: [''],
		serverUrlLogin			: [''],
		serverPortalUri			: [''],
		mailFromEmail				: [''],
		mailFromName				: [''],
		mailApiKeyPublic		: [''],
		mailApiKeyPrivate		: [''],
		mailGenericTemplate	: [0],
		mailTemplateErrorDeliver 	: [false],
		mailTemplateErrorRepEmail : [''],
		mailTemplateErrorRepName	: [''],
		mailSaveEmail				: [false],
		routesJsonBodyLimit	: [''],
		freshServerUrl			: [''],
		freshApiKey					: [''],
		freshUsersCategory	: [''],
		freshPublicFolder		: [''],
		freshUsersFolder		: [''],
		freshRequesterFolder	: [''],
		freshSuperFolder		: [''],
		freshOperatorFolder	: [''],
		freshTechFolder			: [''],
		freshBillFolder			: [''],
		cacheUrl 						: [''],
		cacheTTLSessions 		: [0],
		cacheTTL						: [0],
		fileServerApi				: [''],
		fileServerContent		: [''],
		fileApiToken				: [''],
		fileNamespaceId			: [''],
		fileTeamMemberId		: [''],
		fileRootFolder			: [''],
		fileMaxSize					: [0],
		fileMaxNumber				: [0],
		fileTempDest				: [''],
		portalVersion				: ['']
	});
	allCategories: Category[] = [];
	categories: Display[] = [];
	folders: Display[] = [];

	constructor(
		private service: ConfigService,
		private commonService: CommonService,
		private fb: FormBuilder,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loading = true;
		this.service.getConfig().subscribe(data => {
			this.loading = false;
			this.config = data;
			this.commonService.displayLog('Config',this.config);
			this.setValues();
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				text: `Hubo un error en la obtención de configuración: ${error.message}`
			});
		});
		// console.log(window.fcWidget);
		window.fcWidget.hide();
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
				if(key.includes('mail')) {
					if(!Object.keys(submitValues).includes('mail')) {
						submitValues.mail = {};
					}
					submitValues.mail[setNewKey(key,'mail')] = control;
				}
				if(key.includes('routes')) {
					if(!Object.keys(submitValues).includes('routes')) {
						submitValues.routes = {};
					}
					submitValues.routes[setNewKey(key,'routes')] = control;
				}
				if(key.includes('fresh')) {
					if(!Object.keys(submitValues).includes('fresh')) {
						submitValues.fresh = {};
					}
					submitValues.fresh[setNewKey(key,'fresh')] = control;
				}
				if(key.includes('cache')) {
					if(!Object.keys(submitValues).includes('cache')) {
						submitValues.cache = {};
					}
					submitValues.cache[setNewKey(key,'cache')] = control;
				}
				if(key.includes('file')) {
					console.log(key);
					if(!Object.keys(submitValues).includes('fileRepo')) {
						submitValues.fileRepo = {};
					}
					submitValues.fileRepo[setNewKey(key,'file')] = control;
					if(key === 'fileMaxSize') {
						submitValues.fileRepo.maxSize *= 1048576;
					}
				}
				if(key.includes('portalVersion')) {
					submitValues.portalVersion = control;
				}
				changes = true;
			}
		});
		// console.log(this.configForm);
		// console.log(submitValues);
		this.commonService.displayLog('configForm',this.configForm);
		this.commonService.displayLog('submitValues',submitValues);
		// return;
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

	setValues() {
		let server	= this.config.server || undefined;
		let mail		= this.config.mail || undefined;
		let routes	= this.config.routes || undefined;
		let fresh 	= this.config.fresh || undefined;
		let cache 	= this.config.cache || undefined;
		let file 		= this.config.fileRepo || undefined;
		this.configForm.setValue({
			serverIssuer				: server?.issuer || '',
			serverExpires				: server?.expires || '',
			serverUrlLogin			: server?.urlLogin || '',
			serverPortalUri			: server?.portalUri || '',
			mailFromEmail				: mail?.fromEmail || '',
			mailFromName				: mail?.fromName || '',
			mailApiKeyPublic		: mail?.apiKeyPublic || '',
			mailApiKeyPrivate		: mail?.apiKeyPrivate || '',
			mailGenericTemplate	: mail?.genericTemplate || 0,
			mailTemplateErrorDeliver 	: mail?.templateErrorDeliver || false,
			mailTemplateErrorRepEmail : mail?.templateErrorReportingEmail || '',
			mailTemplateErrorRepName	: mail?.templateErrorReportingName || '',
			mailSaveEmail				: mail?.saveEmail || false,
			freshServerUrl			: fresh?.serverUrl || '',
			freshApiKey					: fresh?.apiKey || '',
			freshUsersCategory	: fresh?.usersCategory + ''|| '',
			freshPublicFolder		: fresh?.publicFolder + ''|| '',
			freshUsersFolder		: fresh?.usersFolder + ''|| '',
			freshRequesterFolder: fresh?.requesterFolder + ''|| '',
			freshSuperFolder		: fresh?.superFolder + ''|| '',
			freshOperatorFolder	: fresh?.operatorFolder + ''|| '',
			freshTechFolder			: fresh?.techFolder + ''|| '',
			freshBillFolder			: fresh?.billFolder + ''|| '',
			cacheUrl						: cache?.url || '',
			cacheTTLSessions		: cache?.timeToLiveSessions || 0,
			cacheTTL						: cache?.timeToLive || 0,
			fileServerApi				: file?.serverApi || '',
			fileServerContent		: file?.serverContent || '',
			fileApiToken				: file?.apiToken || '',
			fileNamespaceId			: file?.namespaceId || '',
			fileTeamMemberId		: file?.teamMemberId || '',
			fileMaxSize					: file?.maxSize / 1048576 || 25, // 25 MB
			fileMaxNumber				: file?.maxNumber || 1,
			fileRootFolder			: file?.rootFolder || '',
			fileTempDest				: file?.tempDest || '',
			routesJsonBodyLimit	: routes.jsonBodyLimit || '',
			portalVersion				: this.config.portalVersion || ''
		});
		this.getFreshConfig();
	}

	get freshUsersCategory() {
		return this.configForm.get('freshUsersCategory');
	}
	get freshPublicFolder() {
		return this.configForm.get('freshPublicFolder');
	}
	get freshUsersFolder() {
		return this.configForm.get('freshUsersFolder');
	}
	get freshRequesterFolder() {
		return this.configForm.get('freshRequesterFolder');
	}
	get freshSuperFolder() {
		return this.configForm.get('freshSuperFolder');
	}
	get freshOperatorFolder() {
		return this.configForm.get('freshOperatorFolder');
	}
	get freshTechFolder() {
		return this.configForm.get('freshTechFolder');
	}
	get freshBillFolder() {
		return this.configForm.get('freshBillFolder');
	}

	getFreshConfig() {
		this.loading = true;
		this.service.getFreshConfig().subscribe(data => {
			// console.group('Data Fresh');
			// console.log(data);
			// console.groupEnd();
			this.allCategories = [];
			if(data && Array.isArray(data) && data.length > 0) {
				data.forEach(cat => {
					if(cat.category) {
						const category = cat.category;
						this.allCategories.push({
							id: category.id + '',
							name: category.name,
							folders: category.folders.map(folder => {
								return {
									id: folder.id,
									name: folder.name,
									visibility: folder.visibility,
									description: folder.description
								}
							})
						});
					}
				});
			}
			this.categories = this.allCategories.map(cat => {
				return {
					value: cat.id,
					viewValue: cat.name
				}
			})
			// console.group('Categories');
			// console.log(this.allCategories);
			// console.log(this.categories);
			// console.groupEnd();
			this.changeCat();
			this.loading = false;
			// console.log(this.freshUsersCategory.value);
		});
	}

	changeCat() {
		const freshCat = this.configForm.get('freshUsersCategory').value;
		if(freshCat !== '') {
			const cat = this.allCategories.find(allCat => allCat.id === freshCat);
			if(cat) {
				this.folders = cat.folders.map(folder => {
					return {
						value: folder.id + '',
						viewValue: folder.name
					}
				});
			}
		}
		// console.group('Folders');
		// console.log(this.folders);
		// console.groupEnd();
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
