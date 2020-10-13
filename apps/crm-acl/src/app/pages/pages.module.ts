import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './pages.routing.module';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [HomeComponent, ErrorComponent],
  imports: [
    CommonModule,
		PageRoutingModule
  ]
})
export class PagesModule { }
