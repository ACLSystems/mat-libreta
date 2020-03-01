import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class BrowerService {
	constructor(
		private deviceService: DeviceDetectorService
	) {}

	detectBrowser() {
		return {
			deviceInfo: this.deviceService.getDeviceInfo(),
			isMobile: this.deviceService.isMobile(),
			isTablet: this.deviceService.isTablet(),
			isDesktop: this.deviceService.isDesktop()
		}
	}
}
