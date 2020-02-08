import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AvatarModule } from 'ngx-avatar';
import localeMX from '@angular/common/locales/es-MX';
import { MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { UserRoutingModule } from './user.routing.module';
import { AccesoriesModule, SafePipe, DateAgoPipe } from '@mat-libreta/shared';

import { ExamModule } from '@mat-libreta/exam';

import { CourseMainComponent } from './courseMain/courseMain.component';
import { BlockComponent } from './block/block.component';
import { BlockLessonComponent } from './block-lesson/block-lesson.component';
import { BlockQuestionnarieComponent } from './block-questionnarie/block-questionnarie.component';
import { BlockTasksComponent } from './block-tasks/block-tasks.component';
import { ProgressComponent } from './progress/progress.component';
import { SupportComponent } from './support/support.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationComponent } from './notification/notification.component';

registerLocaleData(localeMX);

@NgModule({
	declarations: [
		SafePipe,
		DateAgoPipe,
		CourseMainComponent,
		BlockComponent,
		BlockLessonComponent,
		BlockQuestionnarieComponent,
		BlockTasksComponent,
		ProgressComponent,
		SupportComponent,
		ProfileComponent,
		NotificationComponent
	],
  imports: [
		CommonModule,
		FormsModule,
		UserRoutingModule,
		AccesoriesModule,
		ExamModule,
		AvatarModule,
		MatFormFieldModule,
		MatDatepickerModule,
		MatInputModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'es-MX'}
	]
})
export class UserModule {}