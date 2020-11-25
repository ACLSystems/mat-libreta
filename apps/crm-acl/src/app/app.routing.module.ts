import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { BaseComponent } from './base/base.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/pages/home',
		pathMatch: 'full'
	},{
		path: '',
		component: BaseComponent,
		children: [
			{
				path: 'pages',
				loadChildren: () => import('./pages/pages.module').then(mod => mod.PagesModule),
				data: {
					preload: true,
					delay: false,
					time: 0
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
    useHash: true,
    relativeLinkResolution: 'legacy'
})
	],
	exports: [
		RouterModule
	],
	providers:[]
})

export class AppRoutingModule {}
