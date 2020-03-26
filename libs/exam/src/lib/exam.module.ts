import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ExamRoutingModule } from './exam.routing.module';
import { AccesoriesModule } from '@mat-libreta/shared';

import { ExamComponent } from './exam/exam.component';
import { LandingComponent } from './landing/landing.component';
import { OptionComponent } from './option/option.component';
import { MapComponent } from './map/map.component';
import { GroupComponent } from './group/group.component';
import { TextComponent } from './text/text.component';
import { TfComponent } from './tf/tf.component';
import { OrderComponent } from './order/order.component';

import { QuestionService } from '@mat-libreta/shared';

@NgModule({
	declarations: [
		ExamComponent,
		LandingComponent,
		OptionComponent,
		MapComponent,
		GroupComponent,
		TextComponent,
		TfComponent,
		OrderComponent
	],
  imports: [
		CommonModule,
		ExamRoutingModule,
		AccesoriesModule,
		MatSelectModule,
		FormsModule,
		DragDropModule
	],
	exports: [
		OptionComponent,
		MapComponent,
		GroupComponent,
		TextComponent,
		TfComponent,
		OrderComponent
	],
	providers: [
		QuestionService
	]
})
export class ExamModule {}
