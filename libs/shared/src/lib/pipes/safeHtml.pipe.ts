import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'htmlSafe' })
export class HtmlSafePipe implements PipeTransform {
	constructor(
		private sanitizer: DomSanitizer
	) {}

	transform(url:string) {
		return this.sanitizer.bypassSecurityTrustHtml(url);
	}
}
