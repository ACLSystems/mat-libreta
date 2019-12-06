import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataTablesModule } from 'angular-datatables';

import { UserRoutingModule } from './users.routing.module';
import { AccesoriesModule } from '@crmshared/accesories/accesories.module';
import { CreateUserComponent } from './create/create.component';
import { ViewUserComponent } from './view/view.component';
import { EditUserComponent } from './edit/edit.component';

@NgModule({
  declarations: [
		CreateUserComponent,
		ViewUserComponent,
		EditUserComponent
	],
  imports: [
    CommonModule,
		UserRoutingModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatIconModule,
		AccesoriesModule,
		DataTablesModule,
		MatAutocompleteModule
  ]
})
export class UsersModule { }
