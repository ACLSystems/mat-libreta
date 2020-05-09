import { Component, OnInit, Input } from '@angular/core';

import { UserCourseService, Discussion } from '@mat-libreta/shared';

@Component({
  selector: 'mat-libreta-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

	loading: boolean = false;
	@Input() courseid: string;
	@Input() groupid: string;
	announcements: Discussion[] = [];

  constructor(
		private userCourseService: UserCourseService,
	) { }

  ngOnInit(): void {
		console.log('Si me llamaron!')
		this.getAnnouncements();
  }

	getAnnouncements() {
		this.loading = true;
    this.userCourseService.getDiscussionCourse(this.courseid, this.groupid, false, '0', '500', '-1','announcement').subscribe(data => {
			// console.log(data);
			if(data && data.message && Array.isArray(data.message) && data.message.length > 0) {
				this.announcements = [...data.message];
			} else {
				this.announcements = [];
			}
			console.log(this.announcements);
			this.loading = false;
		}, error => {
			console.log(error);
			this.loading = false;
		});
	}

	hideCard(){
		const card = document.getElementById('announcement');
		if(card) {
			card.style.display = 'none';
		}
	}

}
