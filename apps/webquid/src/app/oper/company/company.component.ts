import { Component, OnInit, Inject, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
//
// declare const $:any;

// window.fcWidget = window.fcWidget || {};

import { OperService } from '../services/oper.services';
import { CommonService } from '@wqshared/services/common.service';
import { Company } from '@wqshared/types/companies.type';
import { Address } from '@wqshared/types/addresses.type';
import { Display } from '@wqshared/types/display.type';

interface Related {
	identifier: string,
	name: string,
	employerRegistration?: String[],
	id?: string
}

@Component({
  selector: 'mat-libreta-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

	companyid: string;
	loading: boolean = false;
	company: Company;
	companyMessage: string = '';
	companyForm = this.fb.group({
		identifier: ['', [
			Validators.required,
			mustBeValidRFC
		]],
		display: ['',[
			Validators.required
		]],
		name: ['',[
			Validators.required
		]]
	});
	addresses: Address[] = [];
	phones: string[] = [];
	companySend: any;
	phonesDirty: boolean = false;
	addressesDirty: boolean = false;
	relatedCostumers: Related[] = [];
	relatedPayers: Related[] = [];
	addPayerRelationER: boolean = false;
	addPayerRelation: boolean = false;
	payerRelationForm = this.fb.group({
		customer: ['',[Validators.required]],
		empRegistration: [''],
		newEmpRegistration: ['']
	});
	customerCompanies: Display[] = [];
	modalMode: boolean = false;
	hideNewEmpReg: boolean = false;
	customersArray: string[] = [];
	empRegis:string[] = [];

  constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) public id: any,
		private operService: OperService,
		private commonService: CommonService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		@Optional() public dialogRef: MatDialogRef<CompanyComponent>,
		private fb: FormBuilder
	) {
		if(id && id.id) {
			this.companyid = id.id;
			this.modalMode = true;
		} else {
			this.activatedRoute.params.subscribe(params => {
				this.companyid = params.companyid;
				this.modalMode = false;
			});
		}
	}

	ngOnInit(): void {

		// if(window.fcWidget.isOpen) {
		// 	window.fcWidget.close();
		// 	window.fcWidget.hide();
		// }
		this.loadCompany();
	}

	get name() {
		return this.companyForm.get('name');
	}

	get identifier() {
		return this.companyForm.get('identifier');
	}

	get display() {
		return this.companyForm.get('display');
	}

	loadCompany() {
		this.loading = true;
		if(this.companyid) {
			this.operService.getCompany(this.companyid).subscribe(data => {
				if(data && data.message && data.message.includes('No hay empresa con el id especificado')) {
					this.companyMessage = data.message;
				} else {
					this.company = data;
					// console.log(this.company);
					this.commonService.displayLog('Compañia', this.company);
					if(this.company.type === 'pagadora') {
						this.relatedCostumers = [];
						this.company.customersRelated.forEach(customer => {
							this.relatedCostumers.push({
								identifier: customer.identifier,
								name: customer.name,
								employerRegistration: (customer.employerRegistration.some((empReg:string) => this.company.employerRegistration.indexOf(empReg) !== -1)) ? this.company.employerRegistration.filter(empReg => customer.employerRegistration.includes(empReg)): [],
								id: customer._id
							});
						});
						this.commonService.displayLog('Clientes', this.relatedCostumers);
						this.customersArray = [...this.company.customersRelated];
						this.empRegis = [...this.company.employerRegistration];
					} else {
						this.relatedPayers = [];
						this.company.payersRelated.forEach(payer => {
							this.relatedPayers.push({
								identifier: payer.identifier,
								name: payer.name,
								employerRegistration: (payer.employerRegistration.some((empReg:string) => this.company.employerRegistration.indexOf(empReg) !== -1)) ? this.company.employerRegistration.filter(empReg => payer.employerRegistration.includes(empReg)): [],
								id: payer._id
							});
						});
					}
					this.populateForm();
				}
				this.loading = false;
			}, error => {
				console.log(error);
				this.companyMessage = error.message;
			});
		}
	}

	rfcUpper() {
		let identifier = this.companyForm.get('identifier');
		identifier.setValue(identifier.value.toUpperCase());
	}

	reloadCompany(id:string) {
		this.companyid = id;
		this.loadCompany();
	}

	goToCompany() {
		this.router.navigate(['/oper/company',this.companyid]);
		if(this.modalMode) this.closeDialog();
	}

	populateForm() {
		this.companyForm.get('identifier').setValue(this.company.identifier || '');
		this.companyForm.get('name').setValue(this.company.name || '');
		this.companyForm.get('display').setValue(this.company.display || '');
		this.addresses = [...this.company.addresses];
		this.phones = [...this.company.phone];
	}

	receiveAddresses(adds:string) {
		this.addresses = [...JSON.parse(adds)];
		// console.log(this.addresses);
		this.addressesDirty = true;
	}

	receivePhones(phs:string) {
		this.phones = [...JSON.parse(phs)];
		// console.log(this.phones);
		this.phonesDirty = true;
	}

	addCustomerRel() {
		if(this.companyForm.get('customer').value === '') {

		}
	}

	submit() {
		this.validateAllFormFields(this.companyForm);
		// console.log(this.companyForm);
		if(this.companyForm.valid) {
			let company = {
				id: this.company._id,
				phone: (this.phonesDirty ) ? [...this.phones] : null,
				name: this.companyForm.get('name').touched ? this.name.value : null,
				display: this.companyForm.get('display').touched ? this.display.value : null,
				identifier: this.companyForm.get('identifier').touched ? this.identifier.value : null,
				addresses: (this.addressesDirty) ? [...this.addresses] : null
			}
			let keys = Object.keys(company);
			keys.forEach(key => {
				if(company[key] === null) {
					delete company[key]
				}
			});

			console.log(company);
			return;
			Swal.fire('Espera...');
			Swal.showLoading();
			this.operService.updateCompany(company).subscribe((data: any) => {
				console.group('Data');
				console.log(data);
				console.groupEnd();
				if(data && data._id === this.company._id) {
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'success',
						text: 'Empresa modificada'
					});
					this.closeDialog();
				}
			}, error => {
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					text: `Hubo un error en la transacción: ${error.message}`
				});
				console.log(company);
				console.log(error)
			});
		} else {
			Swal.fire({
				type: 'error',
				text: 'Por favor revisa los errores',
				timer: 2000,
				showConfirmButton: false
			});
		}
	}

	closeDialog() {
		if(this.modalMode) this.dialogRef.close();
		if(!this.modalMode) this.router.navigate(['/oper']);
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

	turnOnPayerRelation() {
		this.addPayerRelation = true;
		this.addPayerRelationER = false;
		this.payerRelationForm.reset();		this.payerRelationForm.get('empRegistration').clearValidators();
		this.payerRelationForm.get('empRegistration').updateValueAndValidity();
		this.loadCustomers();
	}

	turnOnPayerRelationER() {
		this.addPayerRelationER = true;
		this.addPayerRelation = false;
		this.payerRelationForm.reset();
		this.payerRelationForm.get('empRegistration').setValidators([Validators.required]);
		this.payerRelationForm.get('empRegistration').updateValueAndValidity();
		this.loadCustomers();
	}

	closePayerRelation() {
		this.addPayerRelationER = false;
		this.addPayerRelation = false;
	}

	// openChat() {
	// 	if(window.fcWidget) {
	// 		console.log(window.fcWidget);
	// 		window.fcWidget.show();
	// 		window.fcWidget.open();
	// 	}
	// }

	loadCustomers() {
		if(this.customerCompanies.length === 0) {
			Swal.fire('Espera...');
			Swal.showLoading();
			this.operService
				.searchCompanies('','cliente')
				.subscribe(data => {
					console.log(data);
					this.customerCompanies = data
						.filter(tempCus =>
							(!tempCus.payersRelated ||
								!tempCus.payersRelated
									.includes(this.companyid)
							)
						)
						.map(cust => {
							return {
								value: cust._id,
								viewValue: `${cust.name} (${cust.identifier})`
							}
						});
					console.log(this.customerCompanies);
					Swal.hideLoading();
					Swal.close();
				}, error => {
					console.log(error);
					Swal.hideLoading();
					Swal.close();
					Swal.fire({
						type: 'error',
						text: 'Lo lamento, hubo un error'
					})
				});
		}
	}

}

function mustBeValidRFC(field: FormControl) {
	let RFC = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;
	let value = field.value;
	if(value === '') {
		return null;
	}
	value = value.toUpperCase();
	return RFC.test(value) ? null : {
		validateEmail: {
			valid: false
		}
	}
}
