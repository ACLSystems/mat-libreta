import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AuthGuard } from '@wqshared/guards/auth.guard';
import { CustomPreloadingWithDelayStrategy } from '@wqshared/preloading/custompreloading.service';
//
import { PagesComponent } from '@wqlayouts/pages.component';
import { LoggedComponent } from '@wqlayouts/logged.component';
import { LandingComponent } from '@wqlayouts/landing.component';


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
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'services',
				loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
				// data: {
				// 	preload: true,
				// 	delay: true,
				// 	time: 2000
				// }
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'requests',
				loadChildren: () => import('./requests/requests.module').then(mod => mod.RequestsModule)
				// data: {
				// 	preload: true,
				// 	delay: true,
				// 	time: 2000
				// }
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'super',
				loadChildren: () => import('./super/super.module').then(mod => mod.SuperModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'oper',
				loadChildren: () => import('./oper/oper.module').then(mod => mod.OperModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'admin',
				loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'billing',
				loadChildren: () => import('./billing/billing.module').then(mod => mod.BillingModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'config',
				loadChildren: () => import('./config/config.module').then(mod => mod.ConfigModule)
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
