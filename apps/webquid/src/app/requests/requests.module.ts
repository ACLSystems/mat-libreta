import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsComponent } from './requests/requests.component';

import { RequestsRoutingModule } from './requests.routing.module';

@NgModule({
  declarations: [RequestsComponent],
  imports: [
    CommonModule,
		RequestsRoutingModule
  ]
})
export class RequestsModule { }