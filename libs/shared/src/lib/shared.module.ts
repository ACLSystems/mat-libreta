import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonService } from './services/common.service';
import { UserService } from './services/user.service';
import { PublicService } from './services/public.service';
import { WindowService } from './services/windowSize.service';


@NgModule({
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
