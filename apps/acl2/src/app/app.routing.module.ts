import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { UsComponent } from './pages/us/us.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/home',
		pathMatch: 'full'
	},{
		path: 'home',
		component: HomeComponent
	},{
		path: 'nosotros',
		component: UsComponent
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
