import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'ngx-avatar';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule,
		RouterModule,
		AvatarModule
  ],
	exports: [ SidebarComponent ]
})
export class SidebarModule { }
