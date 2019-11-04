import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoadingSpinnerComponent } from '@cetecshared/spinners/loading.component';
import { SharedFooterComponent } from '@cetecshared/footer/footer.component';

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
