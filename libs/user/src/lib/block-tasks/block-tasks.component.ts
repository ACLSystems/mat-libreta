import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpResponse, HttpEventType } from '@angular/common/http';

import {
	UserService,
	UserCourseService,
	Task,
	TaskEntry,
	NotElemService,
	CommonService,
} from '@mat-libreta/shared';

type FileString = {
	name: string;
	size: number;
	mimeType?: string;
	type?: string;
	data?: any;
	error?: string;
	result?: string;
};

declare const $: any;

@Component({
	selector: 'app-block-tasks',
	templateUrl: './block-tasks.component.html',
	styleUrls: ['./block-tasks.component.scss'],
})
export class BlockTasksComponent implements OnInit {
	@Input() tasks: Task[];
	@Input() blockid: string;
	@Input() groupid: string;
	@Input() courseCode: string;
	@Input() groupCode: string;
	textareaValue: string = '';
	isSendTask = false;
	isAttachment = false;
	taskStudent: Task[] = [];
	files: File[] = [];
	fileName: string;
	fileString: FileString[] = [];
	filesSelected: boolean = false;
	loadFilesForm = this.fb.group({
		file: ['', Validators.required],
	});

	currentFileUpload: File;
	progress: {
		percentage: number;
		status: string;
		statusAlert: string;
		icon: string;
	} = {
		percentage: 0,
		status: 'Cargando...',
		statusAlert: 'alert-info',
		icon: 'fas fa-info-circle',
	};

	constructor(
		private userService: UserService,
		private userCourseService: UserCourseService,
		private notElemService: NotElemService,
		private fb: FormBuilder,
		private commonService: CommonService
	) {}

	ngOnInit() {
		this.commonService.displayLog('Tareas', this.tasks);
		// this.tasks.forEach((task) => {
		// 	task.type = 'ddlmmr';
		// });
	}

	sendTasks(force?: boolean) {
		const task: TaskEntry = {
			groupid: this.groupid,
			id: this.groupid,
			blockid: this.blockid,
			task: this.taskStudent,
			force: force || false,
		};
		this.commonService.displayLog('Tareas',task);
		this.userCourseService.sendTasks(JSON.stringify(task)).subscribe(
			(data) => {
				if (data && data.message && data.message.includes('task saved')) {
					this.notElemService.showNotification(
						'bottom',
						'left',
						'success',
						'Actividades enviadas correctamente'
					);
				} else {
					this.notElemService.showNotification(
						'bottom',
						'left',
						'warning',
						'Las actividades se enviaron, pero no recibimos confirmación correcta.'
					);
				}
			},
			(error) => {
				console.log(error);
				this.notElemService.showNotification(
					'bottom',
					'left',
					'danger',
					'Hubo un error en el envío. Intenta nuevamente más tarde'
				);
			}
		);
	}

	uploadFile(event: any, idtask: string, label: string, text: string) {
		const maxSize = 1048576;
		//this.messageUserSuccess = null;
		//this.messageUserError = null;
		this.isAttachment = false;
		this.progress.status = 'Cargando...';
		this.progress.statusAlert = 'alert-info';
		this.progress.icon = 'fas fa-info-circle';
		this.currentFileUpload = event.target.files[0];
		var sizeOf = function (bytes: number) {
			if (bytes == 0) {
				return '0.00 B';
			}
			var e = Math.floor(Math.log(bytes) / Math.log(1024));
			return (
				(bytes / Math.pow(1024, e)).toFixed(2) + ' ' + ' KMGTP'.charAt(e) + 'B'
			);
		};
		if (
			event.target.files.length === 1 &&
			this.currentFileUpload.size <= maxSize
		) {
			// var that = this;
			this.progress.percentage = 0;
			this.userCourseService
				.setAttachment(this.currentFileUpload, this.courseCode, this.groupCode)
				.subscribe(
					(event) => {
						if (event.type === HttpEventType.UploadProgress) {
							this.progress.percentage = Math.round(
								(100 * event.loaded) / event.total
							);
							if (this.progress.percentage === 100) {
								this.progress.status = 'Procesando...';
								this.progress.statusAlert = 'alert-info';
								this.progress.icon = 'fas fa-info-circle';
							}
						} else if (event instanceof HttpResponse) {
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
							this.commonService.displayLog('Fileid', event.body.fileId);
							this.setTask(event.body.fileId, 'file', idtask, label, text);
						}
					},
					(error) => {
						this.progress.status = 'Error en la carga';
						this.progress.statusAlert = 'alert-danger';
						this.progress.icon = 'fas fa-exclamation-triangle';
						console.log(error);
					}
				);
		} else {
			this.progress.status =
				'Archivo mide ' +
				sizeOf(this.currentFileUpload.size) +
				' y no puede ser mayor a ' +
				sizeOf(maxSize);
			this.progress.statusAlert = 'alert-warning';
			this.progress.icon = 'fas fa-exclamation-triangle';
			//this.messageUserError = 'Archivo mide: '+ sizeOf(this.currentFileUpload.size) +' El archivo no puede ser mayor a ' + sizeOf(maxSize);
		}
	}

	setTask(
		content: string,
		type: string,
		id: string,
		label: string,
		text: string
	) {
		if (this.taskStudent.find((idTask) => idTask.id === id)) {
			const indexRepeat = this.taskStudent.indexOf(
				this.taskStudent.find((idTask) => idTask.label === label)
			);
			this.taskStudent.splice(indexRepeat, 1);
			this.taskStudent.push({ id, content, type, label, text });
			this.isAttachment = true;
		} else {
			this.taskStudent.push({ id, content, type, label, text });
			this.isAttachment = true;
		}
		this.commonService.displayLog('Tareas del estudiante', this.taskStudent);
	}

	receiveTask(event:any){
		this.setTask(
			event.content,
			event.type,
			event.id,
			event.label,
			event.text
		);
	}
}
