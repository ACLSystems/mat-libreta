import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AuthGuard } from '@wqshared/guards/auth.guard';
//
import { PagesComponent } from '@wqlayouts/pages.component';
// import { LandingComponent } from '@wqlayouts/landing.component';
import { LoggedComponent } from '@wqlayouts/logged.component';

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
				loadChildren: () => import('./pages/pages.module').then(mod => mod.PagesModule)
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
			}
		]
	// },{
	// 	path: '',
	// 	component: LoggedComponent,
	// 	canActivate: [AuthGuard],
	// 	children: [
	// 		{
	// 			path: 'users',
	// 			loadChildren: () => import('./users/users.module').then(mod => mod.UsersModule)
	// 		}
	// 	]
	// },{
	// 	path: '',
	// 	component: LoggedComponent,
	// 	canActivate: [AuthGuard],
	// 	children: [
	// 		{
	// 			path: 'accounts',
	// 			loadChildren: () => import('./accounts/accounts.module').then(mod => mod.AccountsModule)
	// 		}
	// 	]
	// },{
	// 	path: '',
	// 	component: LoggedComponent,
	// 	canActivate: [AuthGuard],
	// 	children: [
	// 		{
	// 			path: 'quotes',
	// 			loadChildren: () => import('./quotes/quotes.module').then(mod => mod.QuotesModule)
	// 		}
	// 	]
	// },{
	// 	path: '',
	// 	component: LoggedComponent,
	// 	canActivate: [AuthGuard],
	// 	children: [
	// 		{
	// 			path: 'opportunities',
	// 			loadChildren: () => import('./opportunities/opportunities.module').then(mod => mod.OpportunitiesModule)
	// 		}
	// 	]
	// },{
	// 	path: '',
	// 	component: LoggedComponent,
	// 	canActivate: [AuthGuard],
	// 	children: [
	// 		{
	// 			path: 'business',
	// 			loadChildren: () => import('./businesses/businesses.module').then(mod => mod.BusinessesModule)
	// 		}
	// 	]
	// },{
	// 	path: '',
	// 	component: LoggedComponent,
	// 	canActivate: [AuthGuard],
	// 	children: [
	// 		{
	// 			path: 'reports',
	// 			loadChildren: () => import('./reports/reports.module').then(mod => mod.ReportsModule)
	// 		}
	// 	]
	// },{
	// 	path: '',
	// 	component: LoggedComponent,
	// 	canActivate: [AuthGuard],
	// 	children: [
	// 		{
	// 			path: 'admin',
	// 			loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
	// 		}
	// 	]
	},{
		path: '**',
		redirectTo: '/pages/error'
	}
];

@NgModule({
  imports: [RouterModule.forRoot(
		routes,{
			useHash:true,
			// enableTracing: true,
			scrollPositionRestoration: 'enabled'
		})
	],
  exports: [RouterModule]
})

export class AppRoutingModule { }
