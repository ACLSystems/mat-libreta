import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@cjaapp/app.module';
import { MdModule } from '@cjamd/md.module';
import { DashboardRoutingModule } from './dashboard.routing';
import { AccesoriesModule } from '@cjashared/accesories/accesories.module';

import { DashboardComponent } from './dashboard.component';
import { DemoComponent } from './demo/demo.component';

import { BlockCopyPasteDirective } from '@cjashared/directives/protect.directive';

@NgModule({
  declarations: [
		DashboardComponent,
		DemoComponent,
		BlockCopyPasteDirective
	],
  imports: [
    CommonModule,
		DashboardRoutingModule,
		FormsModule,
		MaterialModule,
		MdModule,
		AccesoriesModule
  ]
})
export class DashboardModule { }
