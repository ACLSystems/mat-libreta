import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { AuthGuard } from '@crmshared/guards/auth.guard';
//
import { PagesComponent } from '@crmlayouts/pages.component';
// import { LandingComponent } from '@crmlayouts/landing.component';
import { LoggedComponent } from '@crmlayouts/logged.component';

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
				path: 'dashboard',
				loadChildren: () => import('./dashboard/dashboard.module').then(mod => mod.DashboardModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'users',
				loadChildren: () => import('./users/users.module').then(mod => mod.UsersModule)
			}
		]
	},{
		path: '',
		component: LoggedComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'accounts',
				loadChildren: () => import('./accounts/accounts.module').then(mod => mod.AccountsModule)
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
			useHash:true,
			// enableTracing: true,
			scrollPositionRestoration: 'enabled'
		})
	],
  exports: [RouterModule]
})

export class AppRoutingModule { }
