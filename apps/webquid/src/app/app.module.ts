// Import librerías Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as Rollbar from 'rollbar';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SimpleGlobal } from 'ng2-simple-global';

import { environment } from '@wqenv/environment';

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
import { FixedpluginModule } from '@wqapp/fixedplugin/fixedplugin.module';
import { SidebarModule } from '@wqsidebar/sidebar.module';
import { NavbarModule } from '@wqnavbar/navbar.module';
import { AccesoriesModule } from '@wqshared/accesories/accesories.module';

//  Import Directivas

// Import componentes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { PagesComponent } from '@wqlayouts/pages.component';
import { LandingComponent } from '@wqlayouts/landing.component';
import { FooterComponent } from '@wqlayouts/footer/footer.component';
import { LoggedComponent } from '@wqlayouts/logged.component';
// import { LoadingSpinnerComponent } from '@wqshared/spinners/loading.component';

import { EnumService } from '@wqshared/services/enum.service';

// import {
// 	UserService,
// 	CommonService,
// 	PublicService,
// 	WindowService
// } from '@mat-libreta/shared';

import { UserService } from '@wqshared/services/user.service';
import { CommonService } from '@wqshared/services/common.service';
import { PublicService } from '@wqshared/services/public.service';
import { WindowService } from '@mat-libreta/shared';
import { OperatorService } from '@wqshared/services/operator.service';

import { TimeoutInterceptor, DEFAULT_TIMEOUT } from '@mat-libreta/shared';
import {
	rollbarFactory,
	RollbarService,
	HttpErrorInterceptor
} from '@wqshared/interceptors/error.interceptor';
import { HelpComponent } from './shared/help/help.component';
import { ArticleComponent } from './shared/article/article.component';

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
	],
	declarations: [HelpComponent, ArticleComponent]
})
export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
		PagesComponent,
		FooterComponent,
		LandingComponent,
		LoggedComponent,
		// LoadingSpinnerComponent
  ],
	exports: [
	],
  imports: [
		CommonModule,
		BrowserAnimationsModule,
		RouterModule,
		ReactiveFormsModule,
		MaterialModule,
		MatDatepickerModule,
		MatSliderModule,
		MatNativeDateModule,
    BrowserModule,
    AppRoutingModule,
		HttpClientModule,
		SidebarModule,
		FixedpluginModule,
		NavbarModule,
		AccesoriesModule
		// SocketIoModule.forRoot(config)
  ],
	providers: [
		PublicService,
		UserService,
		WindowService,
		CommonService,
		EnumService,
		SimpleGlobal,
		OperatorService,
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
export class AppModule { }
