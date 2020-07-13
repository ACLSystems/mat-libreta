// Import librerías Angular
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, InjectionToken } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';
import * as Rollbar from 'rollbar';
import { SimpleGlobal } from 'ng2-simple-global';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { environment } from '@cjaenv/environment';

// const config: SocketIoConfig = {
// 	url: environment.url,
// 	options: {}
// }

// Import librerías Angular Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Import otros módulos
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FixedpluginModule } from '@cjaapp/fixedplugin/fixedplugin.module';
import { SidebarModule } from '@cjasidebar/sidebar.module';
import { NavbarModule } from '@cjanavbar/navbar.module';

//  Import Directivas

// Import componentes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { PagesComponent } from '@cjalayouts/pages.component';
import { LandingComponent } from '@cjalayouts/landing.component';
import { FooterComponent } from '@cjalayouts/footer/footer.component';
import { LoggedComponent } from '@cjalayouts/logged.component';

import {
	CommonService,
	UserService,
	UserCourseService,
	CurrentCourseService,
	PublicService,
	WindowService,
	AccesoriesModule,
	BrowerService,
	RefreshDiscussionService
} from '@mat-libreta/shared';

import { ShareService } from '@cjashared/services/share.service';
import { EnvService } from '@cjashared/services/setEnv.service';

import {
	TimeoutInterceptor,
	DEFAULT_TIMEOUT
} from '@mat-libreta/shared';
import {
	rollbarFactory,
	RollbarService,
	HttpErrorInterceptor
} from '@cjashared/interceptors/error.interceptor';

@NgModule({
	exports: [
		MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
	]
})
export class MaterialModule {}


@NgModule({
	declarations: [
    AppComponent,
		PagesComponent,
		FooterComponent,
		LandingComponent,
		LoggedComponent
  ],
	exports: [
	],
  imports: [
		CommonModule,
		BrowserAnimationsModule,
		RouterModule,
		MaterialModule,
		MatNativeDateModule,
    BrowserModule,
    AppRoutingModule,
		HttpClientModule,
		SidebarModule,
		FixedpluginModule,
		NavbarModule,
		AccesoriesModule,
		DeviceDetectorModule.forRoot(),
		// SocketIoModule.forRoot(config)
  ],
	providers: [
		EnvService,
		PublicService,
		UserService,
		UserCourseService,
		WindowService,
		CommonService,
		ShareService,
		CurrentCourseService,
		BrowerService,
		RefreshDiscussionService,
		SimpleGlobal,
		[{
			provide: HTTP_INTERCEPTORS,
			useClass: TimeoutInterceptor, multi: true
		}],
		[{
			provide: DEFAULT_TIMEOUT,
			useValue: 30000
		}],
		[
			{
				provide: RollbarService,
				useFactory: rollbarFactory
			},{
				provide: HTTP_INTERCEPTORS,
				useClass: HttpErrorInterceptor,
				multi: true
			}
		]
	],
  bootstrap: [AppComponent]
})
export class AppModule {}
