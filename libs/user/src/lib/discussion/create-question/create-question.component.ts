import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { UserCourseService, RefreshDiscussionService,NotElemService, Doubt } from '@mat-libreta/shared';

@Component({
  selector: 'mat-libreta-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css']
})
export class CreateQuestionComponent implements OnInit {

	askForm = this.fb.group({
		subject: ['', [
			Validators.required
		]],
		description: ['', [
			Validators.required
		]]
	});

	get subject() {
		return this.askForm.get('subject');
	}

	get description() {
		return this.askForm.get('description');
	}

	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<CreateQuestionComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
		private userCourseService: UserCourseService,
		private refreshDiscussion: RefreshDiscussionService,
		private notElementService: NotElemService
	) { }

	ngOnInit(): void {
	}

	closeDialog() {
		this.dialogRef.close();
	}

	sendQuestion() {
		this.validateAllFormFields(this.askForm);
		if(this.askForm.valid) {
			let doubt: Doubt = {
				course: this.data.courseid,
				type: 'root',
				title: this.subject.value,
				text: this.description.value,
				pubtype: 'question',
				block: this.data.blockid,
				group: this.data.groupid
			}
			this.userCourseService.setDiscusion(doubt).subscribe(data => {
				if(data && data.message && data.message === 'Register created') {
					this.notElementService.showNotification(
						'bottom',
						'left',
						'info',
						'Pregunta creada'
					);
					this.refreshDiscussion.sendRefresh('refresh');
				}
			}, error => {
				console.log(error);
				Swal.fire({
					type: 'error',
					text: 'No se pudo enviar tu pregunta. Intenta nuevamente más tarde'
				});
			});
			this.closeDialog();
		} else {
			Swal.fire({
				type: 'error',
				text: 'Por favor llena los campos para poder enviar tu pregunta',
				timer: 2000,
				showConfirmButton: false
			});
		}
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if(control instanceof FormControl) {
				control.markAsDirty({ onlySelf: true});
			} else if(control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

}
