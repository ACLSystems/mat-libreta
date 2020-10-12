import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from '../app.module';
import { NgxFilesizeModule } from 'ngx-filesize';

import { DashboardRoutingModule } from './dashboard.routing';
import { AccesoriesModule } from '@mat-libreta/shared';

import { DashboardComponent } from './dashboard.component';

// import { BlockCopyPasteDirective } from '@crmshared/directives/protect.directive';

import { HTTPService } from '@mat-libreta/shared';
import { ServiceComponent } from './service/service.component';

import { SN001Component } from './service/sn001/sn001.component';
import { SN001AdminComponent } from './service/sn001-admin/sn001-admin.component';
import { Sn002Component } from './service/sn002/sn002.component';
import { Sn003Component } from './service/sn003/sn003.component';
import { Sn004Component } from './service/sn004/sn004.component';
import { Sn006Component } from './service/sn006/sn006.component';
import { Sn007Component } from './service/sn007/sn007.component';
import { Sn008Component } from './service/sn008/sn008.component';
import { ProfileComponent } from './profile/profile.component';
import { GenericComponent } from './service/generic/generic.component';
import { OtherComponent } from './service/other/other.component';

@NgModule({
  declarations: [
		DashboardComponent,
		ServiceComponent,
		SN001Component,
		SN001AdminComponent,
		Sn002Component,
		Sn003Component,
		Sn004Component,
		Sn006Component,
		Sn007Component,
		Sn008Component,
		ProfileComponent,
		GenericComponent,
		OtherComponent
	],
  imports: [
    CommonModule,
		DashboardRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		// MatSelectModule,
		// MatInputModule,
		// MdModule,
		AccesoriesModule,
		// MatDatepickerModule,
		NgxFilesizeModule
  ],
	providers: [
		HTTPService
	]
})
export class DashboardModule { }
