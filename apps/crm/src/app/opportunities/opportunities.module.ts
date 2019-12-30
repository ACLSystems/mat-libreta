import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewOpportunitiesComponent } from './view/view.component';

import { OpportunitiesRoutingModule } from './opportunities.routing.module';

@NgModule({
  declarations: [ViewOpportunitiesComponent],
  imports: [
    CommonModule,
		OpportunitiesRoutingModule
  ]
})
export class OpportunitiesModule { }
