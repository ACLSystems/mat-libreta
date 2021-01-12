import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonService } from './services/common.service';
import { UserService } from './services/user.service';
import { PublicService } from './services/public.service';
import { WindowService } from './services/windowSize.service';

import { DateAgoPipe } from './pipes/dateago.pipe';
import { VideoSafePipe } from './pipes/video.pipe';
import { HtmlSafePipe } from './pipes/safeHtml.pipe';

@NgModule({
	declarations: [
		DateAgoPipe,
		HtmlSafePipe,
		VideoSafePipe
	],
  imports: [
		CommonModule
	],
	providers: [
		CommonService,
		UserService,
		PublicService,
		WindowService
	]
})
export class SharedModule {}
