import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FreshworksComponent } from './freshworks/freshworks.component';

@NgModule({
  declarations: [
		NavbarComponent,
		FooterComponent,
		FreshworksComponent
	],
  imports: [
    CommonModule,
		RouterModule
  ],
	exports: [
		NavbarComponent,
		FooterComponent,
		FreshworksComponent
	]
})
export class SharedModule { }
