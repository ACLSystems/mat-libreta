import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ngx-avatar';
import { TourNgBootstrapModule } from 'ngx-tour-ng-bootstrap';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
		RouterModule,
		AvatarModule,
		TourNgBootstrapModule
  ],
	exports: [ SidebarComponent ]
})
export class SidebarModule { }
