import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { ProductsRoutingModule } from './product.routing.module';
import { FreshserviceComponent } from './freshservice/freshservice.component';


@NgModule({
  declarations: [
		FreshserviceComponent
	],
  imports: [
    CommonModule,
		ProductsRoutingModule,
		SharedModule
  ]
})
export class ProductsModule { }
