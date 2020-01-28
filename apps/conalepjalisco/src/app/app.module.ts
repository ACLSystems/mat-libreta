// Import librerías Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// import { environment } from '@env/environment';

const config: SocketIoConfig = {
	url: 'https://apiadminconjalisco.sloppy.zone',
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
	PublicService,
	WindowService,
	AccesoriesModule
} from '@mat-libreta/shared';


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
		SocketIoModule.forRoot(config)
  ],
	providers: [
		PublicService,
		UserService,
		UserCourseService,
		WindowService,
		CommonService
	],
  bootstrap: [AppComponent]
})
export class AppModule {}
