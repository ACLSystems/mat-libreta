import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CourseMainComponent } from './courseMain/courseMain.component';
import { ProgressComponent } from './progress/progress.component';
import { BlockComponent } from './block/block.component';
import { SupportComponent } from './support/support.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationComponent } from './notification/notification.component';
import { CalendarComponent } from './calendar/calendar.component';

const userRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'progress/:rostertype/:id',
				component: ProgressComponent
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'content/:rostertype/:id',
				component: CourseMainComponent
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'calendar/:rostertype/:id',
				component: CalendarComponent
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'support/:rostertype/:id',
				component: SupportComponent
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'block/:rostertype/:id/:blockid',
				component: BlockComponent
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'notification/:notificationid',
				component: NotificationComponent
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'profile',
				component: ProfileComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(userRoutes)
	],
	exports: [
		RouterModule
	]
})

export class UserRoutingModule {}
