import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { QuotesRoutingModule } from './quotes.routing.module';
import { AccesoriesModule } from '@crmshared/accesories/accesories.module';
import { ViewQuotesComponent } from './view/view.component';
import { CreateQuoteComponent } from './create/create.component';

@NgModule({
  declarations: [
		ViewQuotesComponent,
		CreateQuoteComponent
	],
  imports: [
    CommonModule,
		ReactiveFormsModule,
		QuotesRoutingModule,
		AccesoriesModule,
		DataTablesModule,
		MatInputModule,
		MatSelectModule,
		MatSliderModule
  ]
})
export class QuotesModule { }
