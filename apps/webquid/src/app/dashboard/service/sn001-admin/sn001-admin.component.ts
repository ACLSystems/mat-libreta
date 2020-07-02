import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { OperatorService } from '@wqshared/services/operator.service';

import { FileString } from '@wqshared/types/files.type';

@Component({
  selector: 'webquid-sn001-admin',
  templateUrl: './sn001-admin.component.html',
  styleUrls: ['./sn001-admin.component.scss']
})
export class SN001AdminComponent implements OnInit {

	loadFilesForm = this.fb.group({
		dirPath: ['', Validators.required]
	});

	files: File[] = [];
	fileName: string;
	fileString: FileString[] = [];
	filesSelected: boolean = false;
	progress: string = '0';
	progressStyle: string = 'width: 0%;';
	progressColor: string = 'bg-success';
	errors: any[] = [];
	success: any[] = [];

  constructor(
		private fb: FormBuilder,
		private operatorService: OperatorService
	) { }

  ngOnInit(): void {
  }

	async filesPicked(files:File[]) {
		this.files = [...files];
		this.progress = '0';
		this.progressStyle = 'width: 0%;';
		this.files = this.files.filter(file => file.type.includes('text/xml'));
		// console.log(this.files);
		this.fileString = [];
		for(let i=0; i < this.files.length; i++) {
			// console.log(i,files[i]);
			// this.files.push(files[i]);
			// let reader = new FileReader();
			// reader.readAsText(files[i]);
			// reader.onloadend = () => {
			// 	let file: FileString = {
			// 		name: this.files[i].name,
			// 		size: this.files[i].size,
			// 		type: 'data',
			// 		mimeType: this.files[i].type,
			// 		data: reader.result.toString()
			// 	}
			// 	this.fileString.push(file);
			// }
			// reader.onerror = () => {
			// 	this.fileString.push({
			// 		name: this.files[i].name,
			// 		size: this.files[i].size,
			// 		type: 'error',
			// 		error: reader.error.message
			// 	});
			// }
			// this.files.push(files[i]);
			let result = await processFile(this.files[i]);
			// console.log(this.files[i]);
			this.fileString.push({
				name: this.files[i].name,
				size: this.files[i].size,
				type: 'data',
				mimeType: this.files[i].type,
				data: result.toString()
			})
		}
		this.filesSelected = true;
		// console.log(this.fileString);
	}

	// processFiles() {
	// 	this.progressbar = 0;
	// 	for(let i=0; i < this.fileString.length; i++) {
	// 		this.operatorService.sendCFDI(this.fileString[i]).subscribe(data => {
	// 			this.fileString[i].result = data;
	// 			setTimeout(() => {
	// 				this.progressbar = Math.floor(1)
	// 			}, 306);
	// 		}, error => {
	// 			this.fileString[i].error = error.error;
	// 			this.fileString[i].type = 'error';
	// 		});
	// 	}
	// }

	processFiles(index:number) {
		if(this.fileString[index]){
			let file = this.fileString[index];
			let len = this.fileString.length;
			this.operatorService
				.sendCFDI(file)
				.subscribe(data => {
					this.progress = index + 1 + '';
					let width = Math.floor((index+1)*100/len);
					this.progressStyle = `width: ${width}%;`;
					this.fileString[index].result = data;
					this.processFiles(index+1);
				}, error => {
					this.fileString[index].error = error.error.replace(/<p>/g,'').replace(/<\/p>/g,'');
					this.fileString[index].type = 'error';
					this.processFiles(index+1);
				});
		}
	}

	clearFiles() {
		this.files = [];
		this.fileString = [];
		this.filesSelected = false;
	}

}


function readFileAsync(file) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result);
		}

		reader.onerror = reject;

		reader.readAsText(file);

	});
}

async function processFile(filename) {
	try {
		return await readFileAsync(filename);
	} catch(e) {
		console.log(e);
	}
}
