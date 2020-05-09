import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
		name: 'filter',
		pure: true
})
export class FilterPipe implements PipeTransform {

	// items es array
	transform(items: any, elem?:string, value?: any): any {
		// console.group('filterPipe');
		// console.log(items);
		// console.log(elem);
		// console.log(value);
		const result = (elem && value) ? items.filter((item:any) => item[elem] === value) : items;
		// console.log(result);
		// console.groupEnd();
		return result;
	}
}
