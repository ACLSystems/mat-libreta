import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AvatarModule } from 'ngx-avatar';
import { FullCalendarModule } from '@fullcalendar/angular';
import localeMX from '@angular/common/locales/es-MX';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import { UserRoutingModule } from './user.routing.module';
import {
	AccesoriesModule,
	VideoSafePipe,
	HtmlSafePipe,
	DateAgoPipe,
	FilterPipe
} from '@mat-libreta/shared';

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
import { DiscussionComponent } from './discussion/discussion.component';
import { CreateQuestionComponent } from './discussion/create-question/create-question.component';
import { ForumComponent } from './discussion/forum/forum.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BlockTaskDdlmrComponent } from './block-task-ddlmr/block-task-ddlmr.component';
import { BlockTaskDdlmmrComponent } from './block-task-ddlmmr/block-task-ddlmmr.component';
import { BlockTaskDdlmComponent } from './block-task-ddlm/block-task-ddlm.component';

registerLocaleData(localeMX);

FullCalendarModule.registerPlugins([
	dayGridPlugin,
	timeGridPlugin,
	listPlugin
]);

@NgModule({
	declarations: [
		VideoSafePipe,
		DateAgoPipe,
		HtmlSafePipe,
		FilterPipe,
		CourseMainComponent,
		BlockComponent,
		BlockLessonComponent,
		BlockQuestionnarieComponent,
		BlockTasksComponent,
		ProgressComponent,
		SupportComponent,
		ProfileComponent,
		NotificationComponent,
		DiscussionComponent,
		CreateQuestionComponent,
		ForumComponent,
		AnnouncementComponent,
		CalendarComponent,
		BlockTaskDdlmrComponent,
		BlockTaskDdlmmrComponent,
		BlockTaskDdlmComponent
	],
  imports: [
		CommonModule,
		FullCalendarModule,
		FormsModule,
		ReactiveFormsModule,
		UserRoutingModule,
		AccesoriesModule,
		ExamModule,
		AvatarModule,
		MatFormFieldModule,
		MatDatepickerModule,
		MatInputModule,
		DragDropModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'es-MX'}
	]
})
export class UserModule {}
