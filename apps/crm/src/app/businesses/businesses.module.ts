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

import { BusinessRoutingModule } from './businesses.routing.module';
import { AccesoriesModule } from '@crmshared/accesories/accesories.module';

import { CreateBusinessComponent } from './create/create.component';
import { EditBusinessComponent } from './edit/edit.component';
import { ViewBusinessComponent } from './view/view.component';


@NgModule({
  declarations: [
		CreateBusinessComponent,
		EditBusinessComponent,
		ViewBusinessComponent],
  imports: [
    CommonModule,
		BusinessRoutingModule,
		AccesoriesModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatIconModule,
		MatTooltipModule,
		MatAutocompleteModule,
		DataTablesModule
  ]
})
export class BusinessesModule { }
