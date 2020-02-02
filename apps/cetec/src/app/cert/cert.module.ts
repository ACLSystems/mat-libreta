import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'

import { CertRoutingModule } from './cert.routing.module';
import { CertComponent } from './cert.component';
import { CertService } from './cert.service';

import { AccesoriesModule } from '@mat-libreta/shared';

@NgModule({
  declarations: [
		CertComponent
	],
  imports: [
    CommonModule,
		CertRoutingModule,
		AccesoriesModule
  ],
	providers: [
		CertService
	]
})
export class CertModule { }
