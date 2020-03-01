import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService, NotElemService, Notification } from '@mat-libreta/shared';

@Component({
  selector: 'mat-libreta-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

	loading: boolean = true;
	notificationId: string;
	notification: Notification;
	notificationPresent: boolean;
	courseEnrollment: boolean;

  constructor(
		private activatedRoute: ActivatedRoute,
		private userService: UserService,
		private notElementService: NotElemService
	) {
		this.loading = true;
		this.activatedRoute.params.subscribe(params => {
			if(params.notificationid){
				this.loading = true;
				this.notificationId = params.notificationid
				this.userService.getNotification(this.notificationId).subscribe(data => {
					this.notificationPresent = true;
					this.notification = data;
					// console.log(this.notification);
					if(this.notification && this.notification.message && this.notification.message.includes('Has sido enrolado al curso')) {
						this.courseEnrollment = true;
					} else {
						this.courseEnrollment = false;
					}
					if(!this.notification.read) {
						this.userService.closeNotification(this.notificationId).subscribe(() => {
							this.notElementService.showNotification(
								'bottom',
								'left',
								'warning',
								'Notificación cerrada'
							);
						});
					}
					this.loading = false;
				});
			} else {
				this.loading = false;
				this.notificationPresent = false;
			}
		});
	}

  ngOnInit() {

  }

}
