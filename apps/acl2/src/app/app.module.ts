import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { UsComponent } from './pages/us/us.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
		AppComponent,
		HomeComponent,
		UsComponent,
		NavbarComponent,
		FooterComponent
	],
  imports: [
    BrowserModule,
		AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [
		AppComponent
	],
})
export class AppModule {}
