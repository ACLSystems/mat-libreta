import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RECAPTCHA_LANGUAGE, RecaptchaModule } from 'ng-recaptcha';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from '@wqapp/app.module';
import { PageRoutingModule } from './pages.routing.module';

import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './error/error-page.component';
import { LoginComponent } from './login/login.component';

import { PagesService } from './pages.service';
import { LogoutComponent } from './logout/logout.component';
import { RecoveraccessComponent } from './recoveraccess/recoveraccess.component';

@NgModule({
  declarations: [
		HomeComponent,
		ErrorPageComponent,
		LoginComponent,
		LogoutComponent,
		RecoveraccessComponent
	],
  imports: [
		MaterialModule,
    CommonModule,
		PageRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		RecaptchaModule
  ],
	providers: [
		PagesService,
		{
			provide: RECAPTCHA_LANGUAGE,
			useValue: 'es-419'
		}
	]
})
export class PagesModule { }
