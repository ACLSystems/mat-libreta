import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ProductsRoutingModule } from './product.routing.module';
import { FreshserviceComponent } from './freshservice/freshservice.component';
import { FreshworksCRMComponent } from './freshworks-crm/freshworks-crm.component';


@NgModule({
  declarations: [
		FreshserviceComponent,
		FreshworksCRMComponent
	],
  imports: [
    CommonModule,
		ProductsRoutingModule,
		SharedModule
  ]
})
export class ProductsModule { }
