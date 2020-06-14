import { Component, OnInit, Inject, Optional } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { OperService } from '../services/oper.services';
import { CommonService } from '@mat-libreta/shared';
import { NotElemService } from '@mat-libreta/shared';

@Component({
  selector: 'mat-libreta-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

	// userid: string;
	loading: boolean = false;
	// user: any;
	userMessage: string = '';
	userForm = this.fb.group({});
	changingPass: boolean = false;
	payroll: boolean = false;

  constructor(
		@Optional() @Inject(MAT_DIALOG_DATA) public user: any,
		// private activatedRoute: ActivatedRoute,
		private operService: OperService,
		private commonService: CommonService,
		private fb: FormBuilder,
		private notElemService: NotElemService,
		public dialogRef: MatDialogRef<UserComponent>
	) {
		// console.group('User modal Constructor')
		// console.log(id);
		// console.groupEnd();
		// if(id && id.id) {
		// 	this.userid = id.id;
		// }
		// this.activatedRoute.params.subscribe(params => {
		// 	this.id = params.id;
		// });
		this.commonService.displayLog('Usuario',this.user);
	}

	returnFromPayroll(back:boolean) {
		// console.log('Esto es back:',back);
		this.payroll = back;
	}

  ngOnInit(): void {
		// this.loading = true;
		// if(this.userid) {
		// 	this.operService.getUser(this.userid).subscribe(data => {
		// 		this.commonService.displayLog('Resultado del Usuario',data);
		// 		if(data && data.message && data.message.includes('No se encontr')) {
		// 			this.userMessage = data.message;
		// 		} else {
		// 			this.user = data;
		// 		}
		// 		this.loading = false;
		// 	}, error => {
		// 		console.log(error);
		// 		this.userMessage = error.message;
		// 	});
		// }
		const user = this.user;
		this.userForm = this.fb.group({
			identifier: [user.identifier,[
				Validators.required
			]],
			nss: [(user.person && user.person.imss) ? user.person.imss : 'Sin NSS',[
				Validators.required
			]],
			curp: [(user.person && user.person.curp) ? user.person.curp : 'Sin CURP',[
				Validators.required
			]],
			name: [(user.person && user.person.name) ? user.person.name : 'Sin Nombre',[
				Validators.required
			]],
			fatherName: [(user.person && user.person.fatherName) ? user.person.fatherName : 'Sin Apellido',[
				Validators.required
			]],
			motherName: [(user.person && user.person.motherName) ? user.person.motherName : 'Sin Apellido',[
				Validators.required
			]],
			email: [(user.person && user.person.email) ? user.person.email : 'Sin Correo',[
				Validators.required
			]],
			pass: [(user.admin && user.admin.initialPassword) ? user.admin.initialPassword : 'Sin Password',[
				Validators.required
			]],
		});
  }

	get identifier() {
		return this.userForm.get('identifier');
	}
	get pass() {
		return this.userForm.get('pass');
	}

	closeDialog() {
		this.dialogRef.close();
	}

	resetPass() {
		this.changingPass = true;
		this.operService.resetPass(this.user._id,this.pass.value).subscribe(data => {
			if(data && data.message && data.message.includes('Nueva contraseña')) {
				this.notElemService.showNotification(
					'bottom',
					'left',
					'success',
					`<i class="far fa-thumbs-up"></i> ${data.message}`
				);
			} else {
				this.notElemService.showNotification(
					'bottom',
					'left',
					'warning',
					`<i class="fas fa-exclamation-triangle"></i> ${data.message}`
				);
			}
			this.changingPass = false;
		});
	}

	showPayrollRcpts() {
		this.payroll = true;
	}

}
