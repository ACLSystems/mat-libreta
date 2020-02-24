// Import librerías Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { environment } from '@wqenv/environment';

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
import { FixedpluginModule } from '@wqapp/fixedplugin/fixedplugin.module';
import { SidebarModule } from '@wqsidebar/sidebar.module';
import { NavbarModule } from '@wqnavbar/navbar.module';
import { AccesoriesModule } from '@wqshared/accesories/accesories.module';

//  Import Directivas

// Import componentes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { PagesComponent } from '@wqlayouts/pages.component';
// import { LandingComponent } from '@wqlayouts/landing.component';
import { FooterComponent } from '@wqlayouts/footer/footer.component';
import { LoggedComponent } from '@wqlayouts/logged.component';
// import { LoadingSpinnerComponent } from '@wqshared/spinners/loading.component';

import { EnumService } from '@wqshared/services/enum.service';

import {
	UserService,
	CommonService,
	PublicService,
	WindowService
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
		// LandingComponent,
		LoggedComponent,
		// LoadingSpinnerComponent
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
		AccesoriesModule
		// SocketIoModule.forRoot(config)
  ],
	providers: [
		PublicService,
		UserService,
		WindowService,
		CommonService,
		EnumService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
