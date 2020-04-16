import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

import { MainComponent } from './main/main.component';

import { OperRoutingModule } from './oper.routing';
import { CompanyComponent } from './company/company.component';
import { UserComponent } from './user/user.component';
import { UsersByCompanyComponent } from './users-by-company/users-by-company.component';

@NgModule({
  declarations: [
		MainComponent,
		CompanyComponent,
		UserComponent,
		UsersByCompanyComponent],
  imports: [
    CommonModule,
		OperRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatDialogModule
  ],
	entryComponents: [
		UserComponent
	]
})
export class OperModule { }
