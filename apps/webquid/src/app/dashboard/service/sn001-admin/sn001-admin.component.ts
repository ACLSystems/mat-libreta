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

  constructor(
		private fb: FormBuilder,
		private operatorService: OperatorService
	) { }

  ngOnInit(): void {
  }

	filesPicked(files:File[]) {
		this.files = [];
		for(let i=0; i < files.length; i++) {
			if(files[i].type === 'text/xml') {
				// console.log(i,files[i].name);
				this.files.push(files[i]);
				let reader = new FileReader();
				reader.readAsText(files[i]);
				reader.onloadend = () => {
					let file: FileString = {
						name: this.files[i].name,
						size: this.files[i].size,
						type: 'data',
						mimeType: this.files[i].type,
						data: reader.result.toString()
					}
					this.fileString.push(file);
				}
				reader.onerror = () => {
					this.fileString.push({
						name: this.files[i].name,
						size: this.files[i].size,
						type: 'error',
						error: reader.error.message
					});
				}
			}
		}
		this.filesSelected = true;
		console.log(this.fileString);
	}

	processFiles() {
		for(let i=0; i < this.fileString.length; i++) {
			this.operatorService.sendCFDI(this.fileString[i]).subscribe(data => {
				this.fileString[i].result = data;
			}, error => {
				this.fileString[i].error = error.error;
				this.fileString[i].type = 'error';
			});
		}
	}

}
