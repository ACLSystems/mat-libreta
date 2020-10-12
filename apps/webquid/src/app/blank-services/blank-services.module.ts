import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceComponent } from './service/service.component';

import { BlankRoutingModule } from './blank-services.routing';
import { Sn005Component } from './sn005/sn005.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
		ServiceComponent,
		Sn005Component
	],
  imports: [
    CommonModule,
		BlankRoutingModule,
		MatInputModule,
		MatDatepickerModule
  ]
})
export class BlankServicesModule { }
