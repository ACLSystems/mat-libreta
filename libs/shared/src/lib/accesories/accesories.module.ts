import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoadingSpinnerComponent } from './spinners/loading.component';
import { SharedFooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
		LoadingSpinnerComponent,
		SharedFooterComponent
	],
  imports: [
    CommonModule,
		RouterModule
  ],
	exports: [
		LoadingSpinnerComponent,
		SharedFooterComponent
	]
})
export class AccesoriesModule { }
