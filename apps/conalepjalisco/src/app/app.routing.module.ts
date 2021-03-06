import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AuthGuard } from '@mat-libreta/shared';

import { PagesComponent } from '@cjalayouts/pages.component';
import { LandingComponent } from '@cjalayouts/landing.component';
import { LoggedComponent } from '@cjalayouts/logged.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/pages/home',
		pathMatch: 'full'
	},{
		path: 'recover/:tokentemp/:username',
		redirectTo: '/land/lostpass/:tokentemp/:username',
		pathMatch: 'prefix'
	},{
		path: 'userconfirm/:tokentemp/:username',
		redirectTo: '/land/userconfirm/:tokentemp/:username',
		pathMatch: 'prefix'
	},{
		path: 'confirm/:tokentemp/:username/:name/:fathername/:mothername',
		redirectTo: '/land/confirm/:tokentemp/:username/:name/:fathername/:mothername',
		pathMatch: 'prefix'
	},{
		path: '',
		component: PagesComponent,
		children: [
			{
				path: 'pages',
				loadChildren: () => import('./pages/pages.module').then(mod => mod.PagesModule)
			}
		]
	},{
		path: '',
		component: LandingComponent,
		children: [
			{
				path: 'land',
				loadChildren: () => import('./landing/landing.module').then(mod => mod.LandingModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: () => import('@mat-libreta/dashboard').then(mod => mod.DashboardModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'user',
				loadChildren: () => import('@mat-libreta/user').then(mod => mod.UserModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'calendar',
				loadChildren: () => import('@mat-libreta/calendar').then(mod => mod.CalendarModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'cert',
				loadChildren: () => import('@cjaapp/cert/cert.module').then(mod => mod.CertModule)
			}
		]
	},{
		path: '',
		canActivate: [AuthGuard],
		children: [
			{
				path: 'exam',
				loadChildren: () => import('@mat-libreta/exam').then(mod => mod.ExamModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'reports',
				loadChildren: () => import('@cjaapp/reports/reports.module').then(mod => mod.ReportsModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'requests',
				loadChildren: () => import('@cjaapp/requests/requests.module').then(mod => mod.RequestsModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'users',
				loadChildren: () => import('@cjaapp/users/users.module').then(mod => mod.UsersModule)
			}
		]
	},{
		path: '**',
		redirectTo: '/pages/error'
	}
];

@NgModule({
  imports: [RouterModule.forRoot(
		routes,{
    useHash: true,
    // enableTracing: true,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})
	],
  exports: [RouterModule]
})

export class AppRoutingModule { }
