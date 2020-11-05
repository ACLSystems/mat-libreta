import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { HomeComponent } from './home/home.component';
import { FreshserviceComponent } from './pages/freshservice/freshservice.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/home',
		pathMatch: 'full'
	},{
		path: 'home',
		component: HomeComponent
	},{
		path: 'freshservice',
		component: FreshserviceComponent
	},{
		path: '**',
		redirectTo: '/home'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(
		routes, {
			useHash: true,
			// enableTracing: true,
			scrollPositionRestoration: 'enabled'
		}
	)]
})
export class AppRoutingModule {}
