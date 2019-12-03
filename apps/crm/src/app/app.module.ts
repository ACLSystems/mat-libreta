// Import librerías Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { environment } from '@crmenv/environment';

const config: SocketIoConfig = {
	url: 'http://localhost:3050',
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
import { FixedpluginModule } from '@crmapp/fixedplugin/fixedplugin.module';
import { SidebarModule } from '@crmsidebar/sidebar.module';
import { NavbarModule } from '@crmnavbar/navbar.module';
import { AccesoriesModule } from '@crmshared/accesories/accesories.module';

//  Import Directivas

// Import componentes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { PagesComponent } from '@crmlayouts/pages.component';
// import { LandingComponent } from '@crmlayouts/landing.component';
import { FooterComponent } from '@crmlayouts/footer/footer.component';
import { LoggedComponent } from '@crmlayouts/logged.component';
// import { LoadingSpinnerComponent } from '@crmshared/spinners/loading.component';

import { CommonService } from '@crmshared/services/common.service';
import { UserService } from '@crmshared/services/user.service';
import { PublicService } from '@crmshared/services/public.service';
import { WindowService } from '@crmshared/services/windowSize.service';

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
		AccesoriesModule,
		SocketIoModule.forRoot(config)
  ],
	providers: [
		PublicService,
		UserService,
		WindowService,
		CommonService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }
