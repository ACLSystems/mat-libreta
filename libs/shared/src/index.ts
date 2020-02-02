// Export modules

export { AccesoriesModule } from './lib/accesories/accesories.module';

// Export pipes

export { SafePipe } from './lib/pipes/video.pipe';

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

// Export Types/Classes

export {
	Result,
	Response,
	Option,
	Answer,
	Question,
	Questionnarie,
	Task,
	Block,
	BlockGrade,
	Grade
} from './lib/types/block.type';

export {
	CurrentCourse
} from './lib/types/course.type';

export {
	Section
} from './lib/types/section.type';

export {
	Identity
} from './lib/types/user.type';

export {
	Environment
} from './lib/types/env.type';
