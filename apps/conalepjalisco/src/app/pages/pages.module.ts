import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RECAPTCHA_LANGUAGE, RecaptchaModule } from 'ng-recaptcha';
//import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@cjaapp/app.module';
import { PageRoutingModule } from './pages.routing.module';

import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './error/error-page.component';
import { HelpComponent } from './help/help.component';
import { CertificateComponent } from './certificate/certificate.component';
import { LoginComponent } from './login/login.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CourseComponent } from './course/course.component';
import { RecoverPassComponent } from './recoverpass/recoverpass.component';
import { OfflineComponent } from './offline/offline.component';
import { UnivComponent } from './univ/univ.component';

import { PagesService } from './pages.service';
import { UserService, PublicService } from '@mat-libreta/shared';
import { RecoverPassService } from './recoverpass/recoverpass.service';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
		HomeComponent,
		ErrorPageComponent,
		HelpComponent,
		CertificateComponent,
		//TimeagoModule,
		LoginComponent,
		PrivacyComponent,
		CatalogComponent,
		CourseComponent,
		RecoverPassComponent,
		OfflineComponent,
		LogoutComponent,
		UnivComponent,
		RegisterComponent
	],
  imports: [
		MaterialModule,
    CommonModule,
		PageRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		RecaptchaModule.forRoot()
  ],
	providers: [
		PagesService,
		UserService,
		RecoverPassService,
		PublicService,
		{
			provide: RECAPTCHA_LANGUAGE,
			useValue: 'es-419'
		}
	]
})
export class PagesModule { }
