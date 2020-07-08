import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { OperRoutingModule } from './oper.routing';

import { MainComponent } from './main/main.component';
import { CompanyComponent } from './company/company.component';
import { UserComponent } from './user/user.component';
import { UsersByCompanyComponent } from './users-by-company/users-by-company.component';
import { CreatecompanyComponent } from './createcompany/createcompany.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { PhonesComponent } from './phones/phones.component';
import { AddressComponent } from './address/address.component';
import { PayrollReceiptsComponent } from './payroll-receipts/payroll-receipts.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { MassiveComponent } from './massive/massive.component';

@NgModule({
  declarations: [
		MainComponent,
		CompanyComponent,
		UserComponent,
		UsersByCompanyComponent,
		CreatecompanyComponent,
		CreateuserComponent,
		PhonesComponent,
		AddressComponent,
		PayrollReceiptsComponent,
		DeliveriesComponent,
		MassiveComponent
	],
	imports: [
		CommonModule,
		OperRoutingModule,
		DataTablesModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatDialogModule,
		MatButtonModule,
		MatTooltipModule,
		MatDatepickerModule,
		MatSelectModule
  ],
	entryComponents: [
		UserComponent,
		CreatecompanyComponent,
		CreateuserComponent
	]
})
export class OperModule { }
