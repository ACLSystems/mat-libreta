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
	progressbar: number = 0;

  constructor(
		private fb: FormBuilder,
		private operatorService: OperatorService
	) { }

  ngOnInit(): void {
  }

	async filesPicked(files:File[]) {
		this.files = [...files];
		this.progressbar = 0;
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

	processFiles() {
		this.progressbar = 0;
		for(let i=0; i < this.fileString.length; i++) {
			this.operatorService.sendCFDI(this.fileString[i]).subscribe(data => {
				this.fileString[i].result = data;
				setTimeout(() => {
					this.progressbar = Math.floor(1)
				}, 306);
			}, error => {
				this.fileString[i].error = error.error;
				this.fileString[i].type = 'error';
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
