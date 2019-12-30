import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
// import { MatChipInputEvent } from '@angular/material/chips';
// import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { UserService } from '@crmshared/services/user.service';
import { CommonService } from '@crmshared/services/common.service';
import { Display } from '@crmshared/types/display.type';
import { Identity } from '@crmshared/types/user.type';
import { Quote } from '@crmshared/types/quote.type';
import { Opportunity, TypeOpp } from '@crmshared/types/opportunity.type';
import { Product, Plan, Price, Base } from '@crmshared/types/product.type';


@Component({
  selector: 'mat-libreta-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateQuoteComponent implements OnInit {

	loading: boolean;
	account		= new FormControl('');
	origin		= new FormControl('');
	owner			= new FormControl('');
	contact		= new FormControl('');
	identity: Identity;

	accountDisplay: string;
	originDisplay: string;
	ownerDisplay: string;
	contactDisplay: string;

	quote: Quote;
	opportunities: Opportunity[] = [];

	vendor		= new FormControl('');
	product 	= new FormControl('');
	plan 			= new FormControl('');
	base			= new FormControl('');
	quantity	= new FormControl(1);
	discount	= new FormControl('0');
	subTotal	: number = 0;
	period		: number;
	price			: number;
	mrr 			: number;
	totalDiscount: number;

	productData	: Product[] = [];
	planData		: Plan[] 		= [];
	baseData		: Base[] 		= [];
	priceData		: Price[] 	= [];
	selectedPlan: Plan = {
		name: '',
		price: [],
		priceBase: 'Otro',
		currency: ''
	}

	enablePlan				: boolean = false;
	showWarningPhase1	: boolean = true;
	enableQuote				: boolean = false;
	enablePhase2			: boolean = false;

	accountsInternal: Display[] = [{
		value: 'no',
		viewValue: 'No existen cuentas'
	}];
	accounts				: Display[] = [{
		value: 'no',
		viewValue: 'No existen cuentas'
	}];
	owners					: Display[] = [{
		value: 'no',
		viewValue: 'No existen usuarios'
	}];
	contacts				: Display[] = [{
		value: 'no',
		viewValue: 'No existen usuarios'
	}];
	vendors 				: Display[] = [{
		value: 'no',
		viewValue: 'No existen marcas/fabricantes'
	}];
	products 				: Display[] = [{
		value: 'no',
		viewValue: 'No existen productos'
	}];
	plans 					: Display[] = [{
		value: 'no',
		viewValue: 'No existen productos'
	}];
	bases 					: Display[] = [{
		value: 'no',
		viewValue: 'No existen periodos base'
	}];

	tags					= [];
	tagsCtrl 			= new FormControl('');
	allTags: string[] = [];
	filteredTags: Observable<string[]>;

  constructor(
		private userService: UserService,
		private commonService: CommonService,
		private router: Router
	) {
		this.enableQuote = false;
		this.enablePhase2 = false;
		this.showWarningPhase1 = true;
	}

  ngOnInit() {
		this.loading = true;
		this.identity = this.userService.getidentity();
		this.populateData();
  }

	populateData() {
		this.userService.orgList().subscribe(data => {
			if(data && Array.isArray(data) && data.length > 0) {
				this.accounts = [];
				this.accountsInternal = [];
				data.forEach(eachAccount => {
					this.accounts.push({
						value: eachAccount._id,
						viewValue: eachAccount.name
					});
					if(eachAccount.type &&
						Array.isArray(eachAccount.type) &&
						eachAccount.type.includes('internal')) {
						this.accountsInternal.push({
							value: eachAccount._id,
							viewValue: eachAccount.name
						});
					}
				});
				this.userService.ownerList().subscribe(data => {
					if(data && Array.isArray(data) && data.length > 0) {
						this.owners = [];
						data.forEach(eachOwner => {
							this.owners.push({
								value: eachOwner._id,
								viewValue: `${eachOwner.person.name.split(' ')[0]} ${eachOwner.person.fatherName}`
							});
							if(eachOwner.name === this.identity.name) {
								this.owner.setValue(eachOwner._id);
							}
						});
						this.userService.getTags().subscribe(data => {
							this.allTags = data;
							this.userService.getUser(this.identity.userid).subscribe(data => {
								let userOrg = data.org;
								for (const org of this.accountsInternal) {
									let found = userOrg.find((uo:any) => uo.name === org.viewValue);
									if(found) {
										this.origin.setValue(org.value);
									}
								}
								this.loading = false;
							}, error => {
								Swal.close();
								Swal.hideLoading();
								Swal.fire({
									type: 'error',
									title: `Hubo un error`
								});
								console.log(error);
								this.loading = false;
							});
						}, error => {
							Swal.close();
							Swal.hideLoading();
							Swal.fire({
								type: 'error',
								title: `Hubo un error`
							});
							console.log(error);
						});
					}
				}, error => {
					Swal.close();
					Swal.hideLoading();
					Swal.fire({
						type: 'error',
						title: `Hubo un error`
					});
					console.log(error);
				});
			}
		}, error => {
			Swal.close();
			Swal.hideLoading();
			Swal.fire({
				type: 'error',
				title: `Hubo un error`
			});
			console.log(error);
		});
	}

	cancel(){
		this.router.navigate(['/quotes']);
	}

	setCustomersArray(account:string) {
		Swal.fire('Espera...');
		Swal.showLoading();
		this.contact.setValue('');
		this.userService.usersList(account).subscribe(data => {
			if(data && Array.isArray(data) && data.length > 0) {
				this.contacts = [];
				data.forEach(cont => {
					this.contacts.push({
						value: `${cont._id}`,
						viewValue: `${cont.person.name} ${cont.person.fatherName}`
					});
				});
			} else {
				this.contacts = [{
					value: 'no',
					viewValue: 'Primero crear usuarios'
				}];
			}
			Swal.close();
			Swal.hideLoading();
		}, error => {
			Swal.close();
			Swal.hideLoading();
			if(error.error.message == 'No hay usuarios') {
				Swal.fire({
					type: 'info',
					text: `No se encontraron usuarios para la cuenta seleccionada`
				});
				this.contacts = [{
					value: 'no',
					viewValue: 'No existen usuarios'
				}];
			} else {
				Swal.fire({
					type: 'error',
					title: `Hubo un error`
				});
				console.log(error);
			}
		});
	}

	displayWarning() {
		if(this.showWarningPhase1) {
			Swal.fire({
				type: 'info',
				title: 'Se generará la cotización',
				html: '<p>Revisa bien los datos antes de iniciar la cotización<br>No pueden modificarse posteriormente</p>'
			});
			this.enableQuote = true;
			this.showWarningPhase1 = false;
		}
	}

	generateQuote() {
		if(this.contact.value == 'no' || !this.contact.value) {
			Swal.fire({
				type: 'error',
				title: 'Debes seleccionar un contacto'
			});
			return;
		}
		this.loading = true;
		Swal.fire('Generando cotización');
		Swal.showLoading();
		this.originDisplay = this.accountsInternal.find(acc => acc.value === this.origin.value).viewValue;
		this.ownerDisplay = this.owners.find(own => own.value === this.owner.value).viewValue;
		this.accountDisplay = this.accounts.find(acc => acc.value === this.account.value).viewValue;
		this.contactDisplay = this.contacts.find(cont => cont.value === this.contact.value).viewValue;
		this.quote = {
			customer: this.contact.value,
			org: this.origin.value,
			customerOrg: this.account.value
		}
		this.userService.generateQuote(this.quote).subscribe(data => {
			this.commonService.displayLog('data',data);
			this.quote.number = data.number;
			this.quote._id = data.id;
			this.quote.status = getStatus(data.status);
			this.product.disable();
			this.plan.disable();
			this.base.disable();
			this.quantity.disable();
			this.discount.disable();
			this.userService.getVendors().subscribe(data => {
				if(data && Array.isArray(data) && data.length > 0) {
					this.vendors = data.map(entry => {
						return {
							value: entry._id,
							viewValue: entry.name
						};
					});
					this.commonService.displayLog('vendors',this.vendors);
					setTimeout(() =>  {
						this.loading = false;
						this.enablePhase2 = true;
						console.log(this.enablePhase2);
						Swal.close();
						Swal.hideLoading();
					}, 1000);
				} else {
					Swal.close();
					Swal.hideLoading();
					Swal.fire({
						type: 'warning',
						html: 'No existen marcas.<br>Favor de contactar al administrador'
					});
				}
			}, error => {
				Swal.fire({
					type: 'error',
					title: `Hubo un error`
				});
				console.log(error);
			});
		}, error => {
			Swal.fire({
				type: 'error',
				title: `Hubo un error`
			});
			console.log(error);
		});
	}

	getProductList(vendor:string) {
		this.commonService.displayLog('vendor',vendor);
		Swal.fire('Obteniendo lista de productos');
		Swal.showLoading();
		this.quantity.setValue(0);
		this.plan.setValue('');
		this.base.setValue('');
		this.price = 0;
		this.quantity.setValue(0);
		this.discount.setValue(0);
		this.subTotal = 0;
		this.mrr = 0;
		this.userService.getProductList(vendor).subscribe(data => {
			if(data && Array.isArray && data.length > 0) {
				this.productData = data;
				this.commonService.displayLog('products',this.productData);
				this.products = data.map((entry: Product) => {
					return {
						value: entry._id,
						viewValue: entry.name
					};
				});
				// this.enableProduct = true;
				this.product.enable();
				this.commonService.displayLog('products',this.products);
				Swal.close();
				Swal.hideLoading();
			} else {
				Swal.close();
				Swal.hideLoading();
				Swal.fire({
					type: 'warning',
					text: 'No existen productos para la marca seleccionada'
				});
			}
		}, error => {
			if(error.error && error.error.message && error.error.message === 'No hay productos que listar') {
				Swal.fire({
					type: 'error',
					text: 'No hay productos para la marca seleccionada'
				});
			} else {
				Swal.fire({
					type: 'error',
					title: `Hubo un error`
				});
				console.log(error);
			}
		});
	}

	getPlanList(product:string) {
		let prod = this.productData.find(prod => prod._id === product);
		if(prod) {
			this.planData = [...prod.plan];
			this.commonService.displayLog('planData',this.planData);
			this.plans = this.planData.map((entry:Plan) => {
				return {
					value: entry.name,
					viewValue: entry.name
				}
			});
			this.enablePlan = true;
			this.plan.enable();
			this.commonService.displayLog('plans',this.plans);
		}
	}

	getBaseList(plan:string) {
		let planFind: Plan = this.planData.find(p => p.name === plan);
		if(planFind) {
			this.baseData = [...planFind.base];
			let prices = [...planFind.price];
			this.bases = prices.map((entry:Price) => {
				let price = new Intl.NumberFormat('es-MX', {
					style: 'currency',
					currency: planFind.currency['symbol']
				}).format(entry.price);
				return {
					value: entry.base,
					viewValue: `${entry.base} - ${price}`
				}
			});
			this.base.enable();
			this.commonService.displayLog('baseData',this.baseData);
			this.commonService.displayLog('bases',this.bases);
		}
	}

	setQuantity() {
		let planData = this.planData.find(plan => plan.name === this.plan.value);
		let priceData = planData.price.find(p => p.base === this.base.value);
		this.quantity.enable();
		this.quantity.setValue(1);
		this.discount.enable();
		this.discount.setValue(priceData.discount);
		this.commonService.displayLog('plan seleccionado',this.plan.value);
		this.commonService.displayLog('base seleccionada',this.base.value);
		this.calculateSubTotal();
		this.quantity.valueChanges.subscribe(() => {
			this.commonService.displayLog('cantidad',this.quantity.value);
			this.calculateSubTotal();
		});
		this.discount.valueChanges.subscribe(() => {
			this.commonService.displayLog('descuento',this.discount.value);
			this.calculateSubTotal();
		});
	}

	fieldDisabled() {
		Swal.fire({
			type: 'info',
			text: 'El campo está deshabilitado debido a que debes llenar otros campos primero'
		})
	}

	calculateSubTotal() {
		this.period = this.baseData.find(data => data.name === this.base.value).period;
		this.selectedPlan = this.planData.find(data => data.name === this.plan.value)
		let prices = [...this.selectedPlan.price];
		this.price = prices.find(data => data.base === this.base.value).price;
		this.subTotal = (this.price * this.quantity.value * this.period) * (1 - (this.discount.value/100));
		this.mrr = (this.price * this.quantity.value) * (1 - (this.discount.value/100));
		this.totalDiscount = (this.price * this.quantity.value * this.period) * (this.discount.value/100);
	}

	generateOpp() {

	}

	formatLabelDiscount(value:number) {
		if(value >= 1) {
			return `${value}%`
		}
		return value;
	}
}

function getStatus(status:number) {
	return {
		new: 'Nueva',
		review: 'En revisión',
		won: 'Ganada',
		lost: 'Perdida'
	}[status]
}
