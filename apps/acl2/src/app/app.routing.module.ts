import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { UsComponent } from './pages/us/us.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { SoonComponent } from './pages/soon/soon.component';

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
		path: 'privacy',
		component: PrivacyComponent
	},{
		path: 'soon',
		component: SoonComponent
	},{
		path: 'products',
		loadChildren: () => import('./products/products.module').then(mod => mod.ProductsModule)
	},{
		path: 'landing',
		loadChildren: () => import('./landing/landing.module').then(mod => mod.LandingModule)
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
