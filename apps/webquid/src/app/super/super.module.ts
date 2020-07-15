import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { DataTablesModule } from 'angular-datatables';

import { MainComponent } from './main/main.component';

import { SuperRoutingModule } from './super.routing';
import { UsersComponent } from './users/users.component';
import { SelcompanyComponent } from './selcompany/selcompany.component';


@NgModule({
  declarations: [MainComponent, UsersComponent, SelcompanyComponent],
  imports: [
    CommonModule,
		SuperRoutingModule,
		MatInputModule,
		MatDialogModule,
		MatSelectModule,
		DataTablesModule
  ]
})
export class SuperModule { }
