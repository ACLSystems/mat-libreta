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

import { environment } from '@cetecenv/environment';

const config: SocketIoConfig = {
	url: environment.url,
	options: {}
}

// Import librerías Angular Material
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
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
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

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
		SocketIoModule.forRoot(config)
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
