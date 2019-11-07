import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Person } from '../classes/person';
import { LandingService } from '../landing.service';
import { environment } from '@cjaenv/environment';

//declare var $:any;
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class ConfirmComponent implements OnInit {

	public urlLibreta:string;
	public tokentemp:string;
	public emailuser:string;
	public name:string;
  public fathername:string;
  public mothername:string;
	public isDataOk:boolean = false;
  public isPassOk:boolean = false;
	public password:string;
	public person:Person;
	public messageSuccess:string;
  public messageError:string;
	public emptyPassword: boolean = true;

  constructor(
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
      if(params['name']!=null){
        this.name = params['name'];
      }
      if(params['fathername']!=null){
        this.fathername = params['fathername'];
      }
      if(params['mothername']!=null){
        this.mothername = params['mothername'];
      }
    });
	}

  ngOnInit() {
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

	/*
  funcion para la confirmacion de usuario y contraseña
  */
	public sendData(){
    this.person = new Person(
			this.emailuser,
			this.tokentemp,
			this.password,
			this.name,
			this.fathername,
			this.mothername);
    this.landingService
			.userConfirm(this.person)
			.subscribe(()=>{
      this.messageSuccess = "Se han guardado los datos exitosamente"
      location.reload(true);
      location.replace(this.urlLibreta);
    },error=>{
      console.log(error);
      this.messageError = error;
    });
  }

	/*
  Metodo de validacion para las contraseñas del usuario
  */
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

}
