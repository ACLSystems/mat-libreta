import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CurrentCourse } from '@cjashared/types/course.type';

@Injectable()
export class CurrentCourseService {


	private currentCourse = new Subject<CurrentCourse>();

	getCurrentCourse = this.currentCourse.asObservable();

	sendCurrentCourse(course: CurrentCourse) {
		this.currentCourse.next(course);
	}

}
