import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';


import { HomeComponent } from './pages/home/home.component';
import { UsComponent } from './pages/us/us.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { SoonComponent } from './pages/soon/soon.component';

@NgModule({
  declarations: [
		AppComponent,
		HomeComponent,
		UsComponent,
		PrivacyComponent,
		SoonComponent
	],
  imports: [
    BrowserModule,
		AppRoutingModule,
    RouterModule,
		SharedModule
  ],
  providers: [],
	exports: [],
  bootstrap: [
		AppComponent
	],
})
export class AppModule {}
