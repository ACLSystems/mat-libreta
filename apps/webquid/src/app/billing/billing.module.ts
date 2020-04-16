import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';

import { BillingRoutingModule } from './billing.routing';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
		BillingRoutingModule
  ]
})
export class BillingModule { }
