import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeGuard } from '@mat-libreta/shared';

import { HomeComponent } from './home/home.component';
import { ErrorPageComponent } from './error/error-page.component';
import { HelpComponent } from './help/help.component';
import { CertificateComponent } from './certificate/certificate.component';
import { LoginComponent } from './login/login.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CatalogComponent } from './catalog/catalog.component';
import { CourseComponent } from './course/course.component';
import { RecoverPassComponent} from './recoverpass/recoverpass.component';
import { OfflineComponent } from './offline/offline.component';
import { LogoutComponent } from './logout/logout.component';

const pageRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				canActivate: [HomeGuard],
				component: HomeComponent
			},{
				path: 'home',
				canActivate: [HomeGuard],
				component: HomeComponent
			},{
				path: 'certificate',
				component: CertificateComponent
			},{
				path: 'catalog',
				component: CatalogComponent
			},{
				path: 'course/:id',
				component: CourseComponent
			},{
				path: 'login',
				component: LoginComponent
			},{
				path: 'reqrecoverpass',
				component: RecoverPassComponent
			},{
				path: 'help',
				component: HelpComponent
			},{
				path: 'privacy',
				component: PrivacyComponent
			},{
				path: 'offline',
				component: OfflineComponent
			},{
				path: 'logout',
				component: LogoutComponent
			},{
				path: 'error',
				component: ErrorPageComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(pageRoutes)
	],
	exports: [
		RouterModule
	]
})

export class PageRoutingModule { }
