import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';

import { SuperRoutingModule } from './super.routing';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
		SuperRoutingModule
  ]
})
export class SuperModule { }
