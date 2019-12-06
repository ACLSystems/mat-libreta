import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataTablesModule } from 'angular-datatables';

import { AccountRoutingModule } from './accounts.routing.module';
import { AccesoriesModule } from '@crmshared/accesories/accesories.module';

import { CreateAccountComponent } from './create/create.component';
import { ViewAccountsComponent } from './view/view.component';
import { EditAccountComponent } from './edit/edit.component';

@NgModule({
  declarations: [
		CreateAccountComponent,
		ViewAccountsComponent,
		EditAccountComponent
	],
  imports: [
    CommonModule,
		AccountRoutingModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatIconModule,
		AccesoriesModule,
		DataTablesModule,
		MatTooltipModule,
		MatAutocompleteModule
  ]
})
export class AccountsModule { }
