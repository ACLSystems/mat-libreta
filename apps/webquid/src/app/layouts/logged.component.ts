import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';
import Swal from 'sweetalert2';
import { SimpleGlobal } from 'ng2-simple-global';
import * as jwt_decode from 'jwt-decode';

import { NavItem, NavItemType} from '@wqmd/md.module';
import { NavbarComponent } from '@wqnavbar/navbar.component';
import { UserService } from '@wqshared/services/user.service';
import { Publicity } from '@wqshared/types/publicity.type';
import { Identity, Roles } from '@wqshared/types/user.type';
import { Company } from '@wqshared/types/companies.type';

import { environment } from '@wqenv/environment';

declare const $: any;

$('#publicityModal').on('shown.bs.modal', function (e) {
	console.log(e);
});

@Component({
	selector: 'webquid-logged-layout',
	templateUrl: './logged.component.html',
	styleUrls: ['./logged.component.scss']
})
export class LoggedComponent implements OnInit, AfterViewInit, OnDestroy {

	public navItems: NavItem[];
	private _router: Subscription;
	private lastPoppedUrl: string;
	private yScrollStack: number[] = [];
	url: string;
	location: Location;
	loading: boolean = false;
	loadPub: boolean = false;
	identity: Identity;
	roles: Roles;
	publicity: Publicity[] = [];
	currentPublicity: Number = 0;
	private intervalReview: Observable<number> = timer(0, 5000);
	private intervalSubscription: Subscription;
	publicityForm = this.fb.group({
		text: ['', Validators.required],
		endDate: [''],
		companies: [''],
		priority: ['100']
	});
	loadingCompanies: boolean = false;
	companiesOptions: Company[] = [];

	// Variables para validar token
	private time: number= 780000; // 13 minutos
	private intervalReviewToken: Observable<number> = timer(0, this.time);
	private intervalSubscriptionToken: Subscription;

	formatLabel(value:number) {
		return value + ''
	}

	@ViewChild('sidebar') sidebar: any;
	@ViewChild(NavbarComponent) navbar: NavbarComponent;

	constructor(
		private router: Router,
		private userService: UserService,
		location: Location,
		private fb: FormBuilder,
		private sg: SimpleGlobal
	) {
		this.location = location;
		this.identity = this.userService.getidentity();
		if(this.identity) {
			this.roles = this.identity.roles;
		}
	}

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('off-canvas-sidebar');
		const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
		const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
		this.location.subscribe((ev:PopStateEvent) => {
				this.lastPoppedUrl = ev.url;
		});
		this.router.events.subscribe((event:any) => {
			if (event instanceof NavigationStart) {
				 if (event.url != this.lastPoppedUrl)
						 this.yScrollStack.push(window.scrollY);
		 } else if (event instanceof NavigationEnd) {
				 if (event.url == this.lastPoppedUrl) {
						 this.lastPoppedUrl = undefined;
						 window.scrollTo(0, this.yScrollStack.pop());
				 }
				 else
						 window.scrollTo(0, 0);
		 }
		});
		this._router = this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
			 elemMainPanel.scrollTop = 0;
			 elemSidebar.scrollTop = 0;
		});
		const html = document.getElementsByTagName('html')[0];
		if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
				let ps = new PerfectScrollbar(elemMainPanel);
				ps = new PerfectScrollbar(elemSidebar);
				html.classList.add('perfect-scrollbar-on');
		}
		else {
				html.classList.add('perfect-scrollbar-off');
		}
		this._router = this.router.events.pipe(
				filter(event => event instanceof NavigationEnd))
				.subscribe((event: NavigationEnd) => {
			this.navbar.sidebarClose();
		});
		this.loadPublicity();
	}
	ngAfterViewInit() {
		this.runOnRouteChange();
		this.intervalSubscription = this.intervalReview.subscribe(interval => {
			this.move(1);
		});
		this.intervalSubscriptionToken = this.intervalReviewToken.subscribe(interval => {
			this.checkTokenValidity();
		});
	}
	ngOnDestroy() {
		this.intervalSubscription.unsubscribe();
		this.intervalSubscriptionToken.unsubscribe();
	}

	get text() {
		return this.publicityForm.get('text');
	}

	get endDate() {
		return this.publicityForm.get('endDate');
	}

	get companies() {
		return this.publicityForm.get('companies');
	}

	get priority() {
		return this.publicityForm.get('priority');
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if(control instanceof FormControl) {
				control.markAsDirty({ onlySelf: true});
			} else if(control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	public isMap() {
		if (this.location.prepareExternalUrl(this.location.path()) === '/maps/fullscreen') {
				return true;
		} else {
				return false;
		}
	}
	runOnRouteChange(): void {
		if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
			const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
			const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
			let ps = new PerfectScrollbar(elemMainPanel);
			ps = new PerfectScrollbar(elemSidebar);
			ps.update();
		}
	}
	isMac(): boolean {
		let bool = false;
		if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
				bool = true;
		}
		return bool;
	}

	loadPublicity() {
		this.loading = true;
		this.userService.getMyPublicity().subscribe(data => {
			if(Array.isArray(data)) {
				this.publicity = data;
			}
			this.loading = false;
			// console.log(this.publicity);
		}, error => {
			console.log(error);
			this.loading = false;
		});
	}

	move(step: number) {
		if(step === 1) {
			if(this.publicity.length > 1) {
				if(this.currentPublicity === 0) {
					this.currentPublicity = +this.currentPublicity + 1;
					return;
				}
				if(this.currentPublicity === this.publicity.length - 1) {
					this.currentPublicity = 0;
					return;
				}
				this.currentPublicity = +this.currentPublicity + 1;
				return;
			}
			this.currentPublicity = 0;
			return;
		}
		if(step === -1) {
			if(this.publicity.length > 1) {
				if(this.currentPublicity === 0){
					this.currentPublicity = this.publicity.length - 1;
					return;
				}
				this.currentPublicity = +this.currentPublicity - 1;
				return;
			}
			this.currentPublicity = 0;
			return;
		}
	}

	loadCompanies() {
		this.loadingCompanies = true;
		this.userService.getCompanies().subscribe(data => {
			this.companiesOptions = data;
			this.loadingCompanies = false;
		}, error => {
			Swal.fire({
				type: 'error',
				text: 'hubo un error'
			});
			console.log(error);
			this.loadingCompanies = false;
		});
	}

	savePublicity() {
		if(this.publicityForm.valid) {
			const endDate = this.publicityForm.get('endDate').value;
			const companies = this.publicityForm.get('companies').value;
			var publicityToCreate: Publicity = {
				text: this.publicityForm.get('text').value,
				priority: this.publicityForm.get('priority').value
			};
			if(endDate) publicityToCreate.endDate = endDate;
			if(Array.isArray(companies) && companies.length > 0) {
				publicityToCreate.companies = companies;
			}
			Swal.fire('Espera...');
			Swal.showLoading();
			this.userService.createPublicity(publicityToCreate).subscribe(data => {
				if(data.message === 'Anuncio creado') {
					Swal.close();
					Swal.hideLoading();
					Swal.fire({
						text: data.message
					});
				} else {
					Swal.close();
					Swal.hideLoading();
				}
				this.loadPublicity();
			}, error => {
				Swal.close();
				Swal.hideLoading();
				Swal.fire({
					'type': 'error',
					'text': 'Hubo un error al intentar crear el anuncio'
				});
				console.log(error);
			});
			this.publicityForm.reset();
			this.publicityForm.patchValue({
				priority: '100'
			});
		} else {
			this.validateAllFormFields(this.publicityForm);
		}
	}

	checkTokenValidity() {
		// Si el token expira hay que generar uno nuevo
		// console.log(new Date());
		const now = Math.floor(new Date().getTime() / 1000);
		// console.log(now);
		const tokenExp = this.sg['tokenExp'];
		// console.log(tokenExp);
		const time = this.time / 1000;
		const diff = tokenExp - now;
		// console.log(diff, time);
		if(diff < time) {
			// console.log('Renovación de token');
			this.userService.refreshToken().subscribe(data => {
				this.sg['token'] = data.token;
				this.sg['tokenVersion'] = environment.tokenVersion;
				this.sg['tokenExp'] = data.exp;
				let decodedToken = this.getDecodedAccessToken(data.token);
				this.identity = {
					identifier: decodedToken.sub,
					companies: decodedToken.companies,
					person: decodedToken.person,
					userid: decodedToken.userid,
					roles: data.roles
				};
				this.sg['identity'] = JSON.stringify(this.identity);
			}, error => {
				console.log(error);
				this.router.navigate(['/pages/login']);
			});
		}
	}

	getDecodedAccessToken(token: string): any {
		try {
			return jwt_decode(token);
		} catch (err)  {
			return null;
		}
	}

	hideCard(){
		const card = document.getElementById('publicity');
		if(card) {
			card.style.display = 'none';
		}
	}

}
