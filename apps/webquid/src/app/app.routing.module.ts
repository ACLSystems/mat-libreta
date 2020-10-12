import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AuthGuard } from '@wqshared/guards/auth.guard';
import { CustomPreloadingWithDelayStrategy } from '@wqshared/preloading/custompreloading.service';
//
import { PagesComponent } from '@wqlayouts/pages.component';
import { LoggedComponent } from '@wqlayouts/logged.component';
import { LandingComponent } from '@wqlayouts/landing.component';
import { BlankComponent } from '@wqlayouts/blank.component';


const routes: Routes = [
	{
		path: '',
		redirectTo: '/pages/home',
		pathMatch: 'full'
	},{
		path: '',
		component: PagesComponent,
		children: [
			{
				path: 'pages',
				loadChildren: () => import('./pages/pages.module').then(mod => mod.PagesModule),
				data: {
					preload: true,
					delay: false,
					time: 2000
				}
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'landing',
				component: LandingComponent,
				loadChildren: () => import('@wqlayouts/landing/landing.module').then(mod => mod.LandingModule)
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'jobs',
				component: LoggedComponent,
				canActivate: [AuthGuard],
				loadChildren: () => import('./jobs/jobs.module').then(mod => mod.JobsModule)
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'services',
				component: LoggedComponent,
				canActivate: [AuthGuard],
				loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule),
				data: {
					preload: true,
					delay: true,
					time: 2000
				}
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'blank',
				component: BlankComponent,
				canActivate: [AuthGuard],
				loadChildren: () => import('./blank-services/blank-services.module').then(mod => mod.BlankServicesModule),
				data: {
					preload: true,
					delay: true,
					time: 2000
				}
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'requests',
				component: LoggedComponent,
				canActivate: [AuthGuard],
				loadChildren: () => import('./requests/requests.module').then(mod => mod.RequestsModule),
				data: {
					preload: true,
					delay: true,
					time: 2000
				}
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'super',
				component: LoggedComponent,
				canActivate: [AuthGuard],
				loadChildren: () => import('./super/super.module').then(mod => mod.SuperModule),
				data: {
					preload: true,
					delay: true,
					time: 2000
				}
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'oper',
				component: LoggedComponent,
				canActivate: [AuthGuard],
				loadChildren: () => import('./oper/oper.module').then(mod => mod.OperModule),
				data: {
					preload: true,
					delay: true,
					time: 2000
				}
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'admin',
				component: LoggedComponent,
				canActivate: [AuthGuard],
				loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule),
				data: {
					preload: true,
					delay: true,
					time: 2000
				}
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'billing',
				component: LoggedComponent,
				canActivate: [AuthGuard],
				loadChildren: () => import('./billing/billing.module').then(mod => mod.BillingModule),
				data: {
					preload: true,
					delay: true,
					time: 2000
				}
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'config',
				component: LoggedComponent,
				canActivate: [AuthGuard],
				loadChildren: () => import('./config/config.module').then(mod => mod.ConfigModule),
				data: {
					preload: true,
					delay: true,
					time: 2000
				}
			}
		]
	},{
		path: '**',
		redirectTo: '/pages/error'
	}
];

@NgModule({
  imports: [
		RouterModule.forRoot(routes,{
			useHash:true,
			// enableTracing: true,
			scrollPositionRestoration: 'enabled',
			preloadingStrategy: CustomPreloadingWithDelayStrategy
		})
	],
  exports: [
		RouterModule
	],
	providers: [
		CustomPreloadingWithDelayStrategy
	]
})

export class AppRoutingModule { }
