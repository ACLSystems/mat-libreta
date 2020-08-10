import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleGlobal } from 'ng2-simple-global';
import { Person } from '../classes/person';
import { LandingService } from '../landing.service';
import Swal from 'sweetalert2';
// import { environment } from '@cjaenv/environment';

//declare var $:any;
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class ConfirmComponent implements OnInit {

	urlLibreta:string;
	tokentemp:string;
	emailuser:string;
	name:string;
  fathername:string;
  mothername:string;
	isDataOk:boolean = false;
  isPassOk:boolean = false;
	password:string;
	person:Person;
	messageSuccess:string;
  messageError:string;
	emptyPassword: boolean = true;

  constructor(
		private landingService: LandingService,
		private activatedRoute: ActivatedRoute,
		private sg: SimpleGlobal,
		private router: Router
	) {
		this.urlLibreta = this.sg['environment'].urlLibreta;
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
	getData($event:any,namecheck:string, fname:string, mname:string){
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
	sendData(){
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
			if(error.includes('Token is not valid')) {
				Swal.fire({
					type: 'warning',
					html: '<p>Ya habías validado antes. Te estamos dirigiendo a la página de ingreso. No utilices el botón de validación nuevamente.</p>'
				})
				this.router.navigate(['/pages/login']);
			} else {
				this.messageError = error;
			}
    });
  }

	/*
  Metodo de validacion para las contraseñas del usuario
  */
  getPassword(passOne:string, passTwo:string){
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
