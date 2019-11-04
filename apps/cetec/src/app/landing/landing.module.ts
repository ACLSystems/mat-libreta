import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@cetecapp/app.module';
import { LandingRoutingModule } from './landing.routing.module';
import { LandingService } from './landing.service';

import { ConfirmComponent } from './confirm/confirm.component';
import { UserConfirmComponent } from './userconfirm/userconfirm.component';
import { LostPassComponent } from './lostpass/lostpass.component';

@NgModule({
  declarations: [
		ConfirmComponent,
		UserConfirmComponent,
		LostPassComponent
	],
  imports: [
    CommonModule,
		LandingRoutingModule,
		MaterialModule
  ],
	providers: [
		LandingService
	]
})
export class LandingModule { }
