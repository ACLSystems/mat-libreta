import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CourseMainComponent } from './courseMain/courseMain.component';
import { ProgressComponent } from './progress/progress.component';
import { BlockComponent } from './block/block.component';
import { SupportComponent } from './support/support.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationComponent } from './notification/notification.component';

const userRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'progress/:groupid',
				component: ProgressComponent
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'content/:groupid',
				component: CourseMainComponent
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'support/:groupid',
				component: SupportComponent
			}
		]
	},{
		path: '',
		children: [
			{
				path: 'block/:courseid/:groupid/:blockid',
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
