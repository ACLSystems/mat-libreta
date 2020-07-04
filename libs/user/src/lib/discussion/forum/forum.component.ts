import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

import { UserCourseService, RefreshDiscussionService, NotElemService, Discussion, CommonService } from '@mat-libreta/shared';

import { CreateQuestionComponent } from '../create-question/create-question.component';

@Component({
  selector: 'mat-libreta-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit, OnDestroy, OnChanges {

	loading: boolean = false;
	@Input() blockid: string;
	@Input() courseid: string;
	@Input() groupid: string;
	@Input() rosterType: string;
	discussions: Discussion[] = [];
	comments: Discussion[] = [];
	replies: Discussion[] = [];
	subscription: Subscription;
	image: any;
	discussionid: string = '';
	discussion: Discussion;
	mouseOvered: boolean = false;
	justOnce: boolean = true;

	commentForm = this.fb.group({
		comment: ['', [Validators.required]]
	});

	constructor(
		private userCourseService: UserCourseService,
		private refreshDiscussion: RefreshDiscussionService,
		private notElementService: NotElemService,
		private commonService: CommonService,
		private matDialog: MatDialog,
		private fb: FormBuilder
	) { }

	get comment() {
		return this.commentForm.get('comment');
	}

	ngOnInit(): void {
		this.getDiscussionCourse();
		this.subscription = this.refreshDiscussion.getRefreshDiscussion.subscribe(() => {
			this.getDiscussionCourse();
		});
	}

	ngOnChanges() {
		// console.group('ids')
		// console.log('Course: ', this.courseid);
		// console.log('Group: ', this.groupid);
		// console.log('Block: ', this.blockid);
		// console.groupEnd();
		if(this.justOnce) {
			this.justOnce = false;
			setTimeout(() => {
				this.getDiscussionCourse();
				this.justOnce = true;
			}, 500);
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	createQuestion() {
		const questionModalDialog = this.matDialog.open(CreateQuestionComponent, {
			id: 'createQuestion',
			height: '414px',
			width: '500px',
			data: {
				courseid: this.courseid,
				blockid: this.blockid,
				groupid: this.groupid
			}
		});
	}

	getDiscussionCourse() {
		this.loading = true;
		// console.log('Entrando en getDiscussionCourse')
    this.userCourseService.getDiscussionCourse(this.courseid, this.groupid, this.blockid, '0', '500', '-1').subscribe(data => {
			// console.log(data);
			if(data && data.message && Array.isArray(data.message) && data.message.length > 0) {
				this.discussions = [...data.message];
			} else {
				this.discussions = [];
			}
			this.loading = false;
			this.commonService.displayLog('Discusiones',this.discussions);
		}, error => {
			// Swal.fire({
			// 	type: 'error',
			// 	text: 'No se pudo recuperar las preguntas. Intenta nuevamente más tarde'
			// });
			console.log(error);
			this.loading = false;
		});
	}

	getComments() {
		this.loading = true;
		// console.log('Entrando en getComments')
    this.userCourseService.getDiscussionCourse(this.courseid, this.groupid, this.blockid, '0', '500', '1', 'question', 'comment', this.discussionid).subscribe(data => {
			// console.log(data);
			if(data && data.message && Array.isArray(data.message) && data.message.length > 0) {
				this.comments = [...data.message];
			} else {
				this.comments = [];
			}
			// console.group('Comments');
			// console.log(this.comments);
			// console.groupEnd();
			this.userCourseService.getDiscussionCourse(this.courseid, this.groupid, this.blockid, '0','500','1','question','reply',false).subscribe(data => {
				if(data && data.message && Array.isArray(data.message) && data.message.length > 0) {
					this.replies = [...data.message];
				} else {
					this.replies = [];
				}
				// console.group('replys')
				// console.log(this.replies);
				// console.groupEnd();
				this.loading = false;
			}, error => {
				console.log(error);
				this.loading = false;
			});
		}, error => {
			// Swal.fire({
			// 	type: 'error',
			// 	text: 'No se pudo recuperar las preguntas. Intenta nuevamente más tarde'
			// });
			console.log(error);
			this.loading = false;
		});
	}

	viewQuestion(index: number) {
		this.discussion = this.discussions[index];
		this.discussionid = this.discussion.discussionId;
		this.getComments();
	}

	returnToDiscussions() {
		this.discussionid = '';
		this.getDiscussionCourse();
	}

	followQuestion() {

	}

	createComment() {
		this.validateAllFormFields(this.commentForm);
		if(this.commentForm.valid) {
			let comment = {
				course: this.courseid,
				type: 'comment',
				text: this.comment.value,
				pubtype: 'question',
				root: this.discussionid,
				replyto: this.discussionid,
				block: this.blockid,
				group: this.groupid
			}
			// console.group('Comment');
			// console.log(comment);
			// console.groupEnd();
			this.userCourseService.setDiscusion(comment).subscribe(data => {
				if(data && data.message && data.message === 'Register created') {
					// console.log(data);
					this.getComments();
					this.comment.setValue('');
					this.notElementService.showNotification(
						'bottom',
						'left',
						'info',
						'Comentario creado'
					);
				}
			}, error => {
				console.log(error);
				Swal.fire({
					type: 'error',
					text: 'No se pudo enviar tu comentario. Intenta nuevamente más tarde'
				});
			})
		} else {
			Swal.fire({
				type: 'warning',
				text: 'Coloca tu comentario si deseas enviarlo'
			});
		}
	}

	createReply(value: any, comment: Discussion) {
		// this.validateAllFormFields(this.replyForm);
		// console.group('Respondiendo a commentario');
		// console.log(comment);
		// console.log(value);
		// console.groupEnd();
		if(value && value != '') {
			let replyData = {
				course: this.courseid,
				type: 'reply',
				text: value,
				pubtype: 'question',
				root: comment.root,
				replyto: comment.discussionId,
				block: this.blockid,
				group: this.groupid
			}
			// console.group('Comment');
			// console.log(comment);
			// console.groupEnd();
			this.userCourseService.setDiscusion(replyData).subscribe(data => {
				if(data && data.message && data.message === 'Register created') {
					// console.log(data);
					this.getComments();
					this.notElementService.showNotification(
						'bottom',
						'left',
						'info',
						'Respuesta creada'
					);
				}
			}, error => {
				console.log(error);
				Swal.fire({
					type: 'error',
					text: 'No se pudo enviar tu comentario. Intenta nuevamente más tarde'
				});
			})
		} else {
			Swal.fire({
				type: 'warning',
				text: 'Coloca tu comentario si deseas enviarlo'
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
