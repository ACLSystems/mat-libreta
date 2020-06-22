import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse, HttpEventType } from '@angular/common/http';

import {
	UserService,
	UserCourseService,
	Task,
	TaskEntry,
	NotElemService,
	CommonService
} from '@mat-libreta/shared';

type FileString = {
	name: string,
	size: number,
	mimeType?: string,
	type?: string,
	data?: any,
	error?: string,
	result?: string
}

declare const $:any;

@Component({
  selector: 'app-block-tasks',
  templateUrl: './block-tasks.component.html',
  styleUrls: ['./block-tasks.component.scss']
})
export class BlockTasksComponent implements OnInit {

	@Input() tasks: Task[];
	@Input() courseCode: string;
	@Input() groupCode: string;
	textareaValue: string = '';
	isSendTask = false;
  isAttachment = false;
	taskStudent: TaskEntry [] = [];
	files: File[] = [];
	fileName: string;
	fileString: FileString[] = [];
	filesSelected: boolean = false;
	loadFilesForm = this.fb.group({
		file: ['', Validators.required]
	});


	currentFileUpload: File;
	progress: {
		percentage: number,
		status: string,
		statusAlert: string,
		icon: string
	} = {
		percentage: 0,
		status: 'Cargando...',
		statusAlert: 'alert-info',
		icon: 'fas fa-info-circle'
	};

	constructor(
		private userService: UserService,
		private userCourseService: UserCourseService,
		private notElemService: NotElemService,
		private fb: FormBuilder,
		private commonService: CommonService
	) {}

	ngOnInit() {
		console.log(this.tasks);
	}

	// async changeInputFile(files: File[]) {
	// 	console.log('Archivo...');
	// 	console.log(files);
	// 	if(files.length === 1) {
	// 		console.log('1 archivo...');
	// 		this.files = [...files];
	// 		this.fileString = [];
	// 		let result = await processFile(this.files[0]);
	// 		this.fileString.push({
	// 			name: this.files[0].name,
	// 			size: this.files[0].size,
	// 			mimeType: this.files[0].type
	// 		})
	// 		this.filesSelected = true;
	// 		console.log(this.fileString);
	// 		this.isAttachment = true;
	// 		this.notElemService.showNotification(
	// 			'bottom',
	// 			'left',
	// 			'success',
	// 			`Archivo ${this.files[0].name} seleccionado`
	// 		);
	// 	}
	// 	if(files.length > 1) {
	// 		this.notElemService.showNotification(
	// 			'bottom',
	// 			'left',
	// 			'warning',
	// 			'Solo elige un archivo, por favor'
	// 		);
	// 	}
	//
	// }

	sendTasks(force: boolean) {

	}

	uploadFile(event: any, idtask: any, label: string) {
		const maxSize = 1048576;
		//this.messageUserSuccess = null;
    //this.messageUserError = null;
    this.isAttachment = false;
		this.progress.status = 'Cargando...';
		this.progress.statusAlert = 'alert-info';
		this.progress.icon = 'fas fa-info-circle';
		this.currentFileUpload = event.target.files[0];
		var sizeOf = function (bytes:number) {
			if(bytes == 0) { return '0.00 B'; }
			var e = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes/Math.pow(1024, e)).toFixed(2)+' '+ ' KMGTP'.charAt(e)+'B';
		}
    if (event.target.files.length === 1 && this.currentFileUpload.size <= maxSize) {
			// var that = this;
			this.progress.percentage = 0;
      this.userCourseService.setAttachment(
        this.currentFileUpload,
        this.courseCode,
        this.groupCode)
				.subscribe(event => {
					if(event.type === HttpEventType.UploadProgress) {
						this.progress.percentage = Math.round(100 * event.loaded / event.total);
						if(this.progress.percentage === 100) {
							this.progress.status = 'Procesando...';
							this.progress.statusAlert = 'alert-info';
							this.progress.icon = 'fas fa-info-circle';
						}
					} else if(event instanceof HttpResponse) {
						this.progress.status = 'Archivo cargado correctamente';
						this.progress.statusAlert = 'alert-success';
						this.progress.icon = 'fas fa-check';
						//this.messageUserSuccess = 'Se cargo el archivo correctamente';
						this.notElemService.showNotification(
							'bottom',
							'left',
							'success',
							'Archivo cargado correctamente'
						);
						// console.log(event.body.fileId);
						this.setTask(event.body.fileId, 'file', idtask, label);
					}
      }, error => {
				this.progress.status = 'Error en la carga';
				this.progress.statusAlert = 'alert-danger';
				this.progress.icon = 'fas fa-exclamation-triangle';
        console.log(error);
      });
    } else {
			this.progress.status = 'Archivo mide '+ sizeOf(this.currentFileUpload.size) +' y no puede ser mayor a ' + sizeOf(maxSize);
			this.progress.statusAlert = 'alert-warning';
			this.progress.icon = 'fas fa-exclamation-triangle';
      //this.messageUserError = 'Archivo mide: '+ sizeOf(this.currentFileUpload.size) +' El archivo no puede ser mayor a ' + sizeOf(maxSize);
    }
  }

	setTask(content: any, type: any, idtask: any, label: string) {
    // if (this.tasks.find(id => id.id=== idtask) ) {
    //   const indexRepeat = this.tasks.indexOf(this.tasks.find(id => id.label === label));
    //   this.tasks.splice(indexRepeat, 1);
    //   this.tasks.push({
		// 		id: idtask,
		// 		text: content,
		// 		type,
		// 		label
		// 	});
    //   this.isAttachment = true;
    // } else {
    //   this.tasks.push({
		// 		id: idtask,
		// 		text: content,
		// 		type,
		// 		label
		// 	});
    //   this.isAttachment = true;
    // }
		// console.log(this.taskStudent)
  }

}
//
// function readFileAsync(file) {
// 	return new Promise((resolve, reject) => {
// 		let reader = new FileReader();
//
// 		reader.onload = () => {
// 			resolve(reader.result);
// 		}
//
// 		reader.onerror = reject;
//
// 		reader.readAsText(file);
//
// 	});
// }
//
// async function processFile(filename) {
// 	try {
// 		return await readFileAsync(filename);
// 	} catch(e) {
// 		console.log(e);
// 	}
// }
