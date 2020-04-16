import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';

import { AdminRoutingModule } from './admin.routing';


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
		AdminRoutingModule
  ]
})
export class AdminModule { }
