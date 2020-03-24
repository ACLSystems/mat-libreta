// Import librerías Angular
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { TourNgBootstrapModule } from 'ngx-tour-ng-bootstrap';

import { environment } from '@cetecenv/environment';

const config: SocketIoConfig = {
	url: environment.url,
	options: {}
}

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
import { FixedpluginModule } from '@cetecapp/fixedplugin/fixedplugin.module';
import { SidebarModule } from '@cetecsidebar/sidebar.module';
import { NavbarModule } from '@cetecnavbar/navbar.module';

//  Import Directivas

// Import componentes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { PagesComponent } from '@ceteclayouts/pages.component';
import { LandingComponent } from '@ceteclayouts/landing.component';
import { FooterComponent } from '@ceteclayouts/footer/footer.component';
import { LoggedComponent } from '@ceteclayouts/logged.component';
// import { LoadingSpinnerComponent } from '@shared/spinners/loading.component';

import {
	CommonService,
	UserService,
	UserCourseService,
	CurrentCourseService,
	PublicService,
	WindowService,
	AccesoriesModule,
	BrowerService,
} from '@mat-libreta/shared';

import { ShareService } from '@cetecshared/services/share.service';
import { EnvService } from '@cetecshared/services/setEnv.service';


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
		SocketIoModule.forRoot(config),
		TourNgBootstrapModule.forRoot()
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
		BrowerService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
