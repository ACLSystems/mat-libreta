import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[appBlockCopyPaste]'
})
export class BlockCopyPasteDirective {
	constructor() {}

	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
		console.log('hola paste');
	}

	@HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
		console.log('hola copy');
	}

	@HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	}
}
