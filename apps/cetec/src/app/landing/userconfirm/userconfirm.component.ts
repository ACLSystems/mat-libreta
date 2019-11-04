import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Person } from '../classes/person';
import { PublicService } from '@cetecshared/services/public.service';
import { LandingService } from '../landing.service';
import { environment } from '@cetecenv/environment';

@Component({
	selector: 'app-userconfirm',
	templateUrl: './userconfirm.component.html',
	styleUrls: ['./userconfirm.component.scss']
})
export class UserConfirmComponent implements OnInit {

	public urlLibreta:string;
	public tokentemp:string;
	public emailuser:string;
	public name:string;
	public fathername:string;
	public mothername:string;
	public isDataOk:boolean = false;
	public isPassOk:boolean = false;
	public password:string;
	public messageSuccess:string;
	public messageError:string;
	public emptyPassword: boolean = true;
	public validated:boolean;
	public person: Person;

	constructor(
		private publicService: PublicService,
		private landingService: LandingService,
		private activatedRoute: ActivatedRoute
	) {
		this.urlLibreta = environment.urlLibreta;
		this.activatedRoute.params.subscribe( params=> {
			if(params['tokentemp']!=null){
				this.tokentemp = params['tokentemp'];
			}
			if(params['username']!=null){ //:tokentemp/:username/:name/:fathername/:mothername
				this.emailuser = params['username'];
			}
		});
	}

	ngOnInit() {
		this.getDetails();
	}

	/*
	Metodo de validación de datos personales del usuario
	*/
	public getData($event:any,namecheck:string, fname:string, mname:string){
		if($event.target.checked){
			this.isDataOk = true;
			this.name = namecheck;
			this.fathername = fname;
			this.mothername = mname;
		}
		if(!$event.target.checked){
			this.isDataOk = false;
		}
	}

	public getDetails(){
		this.publicService.getUserDetails(this.emailuser).subscribe(
			data=>{
				//console.log(data);
				this.name = data.user.person.name;
				this.fathername = data.user.person.fatherName;
				this.mothername = data.user.person.motherName;
				this.validated = data.validated;
			},
			error=>{
				console.log(error);
			}
		);
	}

	public getPassword(passOne:string, passTwo:string){
		if(passOne && passTwo) {
			this.emptyPassword = false;
		}
		if(passOne==passTwo && !this.emptyPassword){
			this.password = passOne;
			this.isPassOk = true;
		}else{
			this.isPassOk = false;
		}
	}

	public sendData(){
		this.person = new Person(this.emailuser, this.tokentemp, this.password, this.name, this.fathername, this.mothername);
		this.landingService.userConfirm(this.person).subscribe(()=>{
			this.messageSuccess = "Se han guardado los datos exitosamente. Usarás tus credenciales para entrar en la siguiente pantalla."
			location.reload(true);
			location.replace(this.urlLibreta + '#/login');
		},error=>{
			if(error.message === 'Token is not valid. Please verify') {
				this.messageError = 'Los datos ya fueron validados. Favor de no utilizar esta página para volver a ingresar. Ve directamente a: ' + this.urlLibreta;
			}
			this.messageError = ' checar la consola ';
			Swal.fire({
				title: 'Se ha generado un error',
				text: this.messageError,
				type: 'error',
				confirmButtonText: 'Ok',
				confirmButtonClass: 'btn btn-danger'
			});
		});
	}

}
