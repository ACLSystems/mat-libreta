import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing.routing.module';
import { RecoveraccessComponent } from './recoveraccess/recoveraccess.component';
import { ConfirmComponent } from './confirm/confirm.component';

@NgModule({
  declarations: [
		RecoveraccessComponent,
		ConfirmComponent
	],
  imports: [
    CommonModule,
		LandingRoutingModule
  ]
})
export class LandingModule { }
