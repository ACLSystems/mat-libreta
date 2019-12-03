import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { AccountRoutingModule } from './accounts.routing.module';
import { AccesoriesModule } from '@crmshared/accesories/accesories.module';

import { CreateAccountComponent } from './create/create.component';
import { ViewAccountsComponent } from './view/view.component';

@NgModule({
  declarations: [
		CreateAccountComponent,
		ViewAccountsComponent
	],
  imports: [
    CommonModule,
		AccountRoutingModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatIconModule,
		AccesoriesModule
  ]
})
export class AccountsModule { }
