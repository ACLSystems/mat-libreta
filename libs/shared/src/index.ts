// Export modules

export { AccesoriesModule } from './lib/accesories/accesories.module';

// Export pipes

export { SafePipe } from './lib/pipes/video.pipe';
export { DateAgoPipe } from './lib/pipes/dateago.pipe';
export { FilterPipe } from './lib/pipes/filter.pipe';

// Export Guards

export { AuthGuard } from './lib/guards/auth.guard';
export { HomeGuard } from './lib/guards/home.guard';
export { CertGuard } from './lib/guards/cert.guard';

// Export services

export { CommonService } from './lib/services/common.service';
export { UserService } from './lib/services/user.service';
export { UserCourseService } from './lib/services/userCourse.service';
export { CurrentCourseService } from './lib/services/currentcourse.service';
export { PublicService } from './lib/services/public.service';
export { WindowService } from './lib/services/windowSize.service';
export { CommService } from './lib/services/comm.service';
export { QuestionService } from './lib/services/question.service';
export { JSONHeaders } from './lib/services/httpHeaders';
export { NotElemService } from './lib/services/notificationElements.service';
export { SuperService } from './lib/services/supervisor.service';
export { BrowerService } from './lib/services/browser.service';
export { HTTPService } from './lib/services/http.service';
export { RefreshDiscussionService } from './lib/services/refreshDiscussion.service';

export { TimeoutInterceptor, DEFAULT_TIMEOUT } from './lib/interceptors/timeout.interceptor';

export { DtOptions } from './lib/config/config.module';

// Export Types/Classes

export {
	Result,
	Response,
	Option,
	Answer,
	Question,
	Questionnarie,
	Task,
	TaskEntry,
	Block,
	BlockGrade,
	Grade
} from './lib/types/block.type';

export {
	CurrentCourse,
	Discussion
} from './lib/types/course.type';

export {
	Section
} from './lib/types/section.type';

export {
	Identity,
	Roles
} from './lib/types/user.type';

export {
	Environment
} from './lib/types/env.type';

export {
	Doubt
} from './lib/types/doubt.type';

export {
	Bell,
	Notification,
	Command
} from './lib/types/notifications.type';
