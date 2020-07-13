import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { SimpleGlobal } from 'ng2-simple-global';
import Swal from 'sweetalert2';

import { Person } from '../classes/person';
import { PublicService } from '@mat-libreta/shared';
// import { LandingService } from '../landing.service';
// import { environment } from '@cjaenv/environment';

@Component({
	selector: 'app-userconfirm',
	templateUrl: './userconfirm.component.html',
	styleUrls: ['./userconfirm.component.scss']
})
export class UserConfirmComponent implements OnInit {

	urlLibreta: string;
	tokentemp	: string;
	emailuser	: string;
	name			: string;
	fathername: string;
	mothername: string;
	validated	: boolean;
	seconds		: number = 10;
	letsGo		: Subscription;
	message 	: string;

	constructor(
		private publicService: PublicService,
		// private landingService: LandingService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private sg: SimpleGlobal
	) {
		this.urlLibreta = this.sg['environment'].urlLibreta;
		this.activatedRoute.params.subscribe( params=> {
			if(params['tokentemp']!=null){
				this.tokentemp = params['tokentemp'];
			}
			if(params['username']!=null){
				this.emailuser = params['username'];
			}
		});
	}

	ngOnInit() {
		this.message = 'Por favor, espera...';
		this.getDetails();
	}

	/*
	Metodo de validación de datos personales del usuario
	*/
	// getData($event:any,namecheck:string, fname:string, mname:string){
	// 	if($event.target.checked){
	// 		this.isDataOk = true;
	// 		this.name = namecheck;
	// 		this.fathername = fname;
	// 		this.mothername = mname;
	// 	}
	// 	if(!$event.target.checked){
	// 		this.isDataOk = false;
	// 	}
	// }

	getDetails(){
		setTimeout(() => {
			this.publicService.getUserDetails(this.emailuser).subscribe(
				data=>{
					// console.log(data);
					if(data && data.message) {
						if(data.message === `User -${this.emailuser}- does not exist`) {
							Swal.fire({
								type: 'error',
								html: `<h3>El usuario <b>${this.emailuser}</b> no existe</h3><br>Por favor, valida que te haya llegado un correo y sigue las instrucciones en él.`
							});
							this.router.navigate(['/pages/home']);
						}
					} else {
						this.name = data.user.person.name;
						this.fathername = data.user.person.fatherName;
						this.mothername = data.user.person.motherName;
						this.validated = data.validated;
						if(data.validated) {
							this.letsGo = interval(1000).subscribe(() => {
								if(this.seconds < 1) {
									this.router.navigate(['/pages/login']);
								}
								this.seconds --;
							});
						} else {
							this.message = 'Validando...';
							const record = {
								email: this.emailuser,
								token: this.tokentemp,
								name: this.name,
								fatherName: this.fathername,
								motherName: this.mothername
							};
							// console.log(record);
							// return;
							this.publicService.confirm(record).subscribe(data => {
								if(data && data.message && data.message == `User -${this.emailuser}- verified`) {
									this.message = 'Cuenta verificada. Gracias'
									Swal.fire({
										type: 'info',
										html: `La cuenta ${this.emailuser} ha sido validada.<br>Gracias`
									});
								}
								this.router.navigate(['/pages/login']);
							}, error => {
								Swal.fire({
									type: 'error',
									text: 'La liga que estás accesando no es correcta o ya expiró'
								});
								this.router.navigate(['/pages/login']);
							});
						}
					}
				},
				error=>{
					console.log(error);
				}
			);
		}, 1000);
	}

	// getPassword(passOne:string, passTwo:string){
	// 	if(passOne && passTwo) {
	// 		this.emptyPassword = false;
	// 	}
	// 	if(passOne==passTwo && !this.emptyPassword){
	// 		this.password = passOne;
	// 		this.isPassOk = true;
	// 	}else{
	// 		this.isPassOk = false;
	// 	}
	// }

	// sendData(){
	// 	this.person = new Person(this.emailuser, this.tokentemp, this.password, this.name, this.fathername, this.mothername);
	// 	this.landingService.userConfirm(this.person).subscribe(()=>{
	// 		this.messageSuccess = "Se han guardado los datos exitosamente. Usarás tus credenciales para entrar en la siguiente pantalla."
	// 		location.reload(true);
	// 		location.replace(this.urlLibreta + '#/login');
	// 	},error=>{
	// 		if(error.message === 'Token is not valid. Please verify') {
	// 			this.messageError = 'Los datos ya fueron validados. Favor de no utilizar esta página para volver a ingresar. Ve directamente a: ' + this.urlLibreta;
	// 		}
	// 		this.messageError = ' checar la consola ';
	// 		Swal.fire({
	// 			title: 'Se ha generado un error',
	// 			text: this.messageError,
	// 			type: 'error',
	// 			confirmButtonText: 'Ok',
	// 			confirmButtonClass: 'btn btn-danger'
	// 		});
	// 	});
	// }

}
