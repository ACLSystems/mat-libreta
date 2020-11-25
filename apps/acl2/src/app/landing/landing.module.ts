import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing.routing.module';
import { SharedModule } from '../shared/shared.module';

import { CalendlyComponent } from './calendly/calendly.component';

@NgModule({
  declarations: [CalendlyComponent],
  imports: [
    CommonModule,
		SharedModule,
		LandingRoutingModule
  ]
})
export class LandingModule { }
