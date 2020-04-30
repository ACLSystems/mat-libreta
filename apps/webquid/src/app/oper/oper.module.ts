import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { OperRoutingModule } from './oper.routing';

import { MainComponent } from './main/main.component';
import { CompanyComponent } from './company/company.component';
import { UserComponent } from './user/user.component';
import { UsersByCompanyComponent } from './users-by-company/users-by-company.component';
import { CreatecompanyComponent } from './createcompany/createcompany.component';
import { CreateuserComponent } from './createuser/createuser.component';

@NgModule({
  declarations: [
		MainComponent,
		CompanyComponent,
		UserComponent,
		UsersByCompanyComponent,
		CreatecompanyComponent,
		CreateuserComponent
	],
	imports: [
		CommonModule,
		OperRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatDialogModule,
		MatButtonModule,
		MatTooltipModule
  ],
	entryComponents: [
		UserComponent,
		CreatecompanyComponent,
		CreateuserComponent
	]
})
export class OperModule { }
