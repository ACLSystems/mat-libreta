import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import {
	Router,
	RouterEvent,
	NavigationEnd,
	NavigationStart
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SimpleGlobal } from 'ng2-simple-global';
import Swal from 'sweetalert2';
import { app, version, year, vendor } from '@version/conalepjalisco_version';

import { EnvService } from '@cjashared/services/setEnv.service';
import { BrowerService, CommonService } from '@mat-libreta/shared';

@Component({
  selector: 'mat-cjal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	private _router: Subscription;
	private browser: any;
	loading: boolean = false;
	navigate: boolean = false;
	title: string;
	description: string;
	siteName: string;
	siteUrl: string;
	bigLogo: string;
	waitLogo: string = '/assets/img/';

	constructor(
		private titleService: Title,
		private metaService: Meta,
		private router: Router,
		private envService: EnvService,
		private browserService: BrowerService,
		private commonService: CommonService,
		private sg: SimpleGlobal
	) {
		console.log(`${app} ${version} @${year} ${vendor}`);
		this.waitLogo += (document.location.hostname === 'localhost') ? 'conalep' : document.location.hostname.split('.')[0];
		this.waitLogo += '.png';
		// console.log(this.waitLogo);
		this.router.events.subscribe((event: RouterEvent) => {
			if(event instanceof NavigationStart) {
				// console.log('Comenzando navegación');
				this.navigate = true;
			} else if(event instanceof NavigationEnd) {
				// console.log('Terminando navegación');
				this.navigate = false;
			}
		});
		this.browser = this.browserService.detectBrowser();
		this.commonService.displayLog('Browser',this.browser);
		if(this.browser && this.browser.deviceInfo && this.browser.deviceInfo.browser != 'Chrome') {
			Swal.fire({
				type: 'warning',
				html: '<img src="assets/img/chrome-logo.svg"><p>Este sitio está optimizado para navegadores Google Chrome de última generación.<br>Para una mejor experiencia te recomendamos utilices Google Chrome si vas a ingresar a este sitio. <br>Puedes descargar Chrome <a href="https://www.google.com.mx/chrome">aquí</a></p>'
			});
		}
	}

	ngOnInit() {
		this.loading = true;
		this.envService.validateEnvironment();
		this.commonService.getCurrentEnvironment.subscribe((message:string) => {
			// console.log('Aquí estamos');
			const tempData = this.sg['instance'];
			// Borrar tempItem
			// localStorage.removeItem('temp');
			// this.commonService.displayLog('tempData',tempData);
			this.title = tempData.instance.title;
			this.description = tempData.instance.description;
			this.siteName = `https://${document.location.hostname}`;
			this.bigLogo = tempData.logo.big;
			this.titleService.setTitle(this.title);
			this.metaService.addTags([
				{ name: 'title', content: this.title},
				{ name: 'og:title', content: this.title},
				{ name: 'og:image', content: this.bigLogo},
				{ name: 'og:type', content: 'website'},
				{ name: 'og:alt', content: this.siteName},
				{ name: 'og:url', content: this.siteUrl},
				{ name: 'og:site_name', content: this.siteName},
				{ name: 'og:description', content: this.description},
				{ name: 'description', content: this.description},
				{ name: 'twitter:title', content: this.siteName},
				{ name: 'twitter:site', content: this.siteName},
				{ name: 'twitter:description', content: this.description}
			]);
			// this.commonService.displayLog('Hostname',document.location.hostname);
			setTimeout(() => {
				this.loading = false;
			},801);
		});
		this._router = this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
			const body = document.getElementsByTagName('body')[0];
			const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
			if (body.classList.contains('modal-open')) {
				body.classList.remove('modal-open');
				modalBackdrop.remove();
			}
		});
	}
}
