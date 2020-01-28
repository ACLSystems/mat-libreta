import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Login } from '../classes/login';
import { PasswordRecovery } from '../classes/passrecovery';
import { UserService, PublicService } from '@mat-libreta/shared';

@Component({
  selector: 'app-lostpass',
  templateUrl: './lostpass.component.html',
  styleUrls: ['./lostpass.component.scss']
})
export class LostPassComponent implements OnInit {

	passwordRecovery: PasswordRecovery;
	tokentemp: string;
	emailuser: string;
	password: string;
	isPassOk: boolean = false;
	login: Login;
  token: any;
	type: string = "text";
	show: boolean = false;

	public messageSuccess: string;
  public messageError: string;

  constructor(
		private router: Router,
		private route: ActivatedRoute,
		private publicService: PublicService,
		private userService: UserService
	) {
		this.route.params.subscribe(params => {
	if (params.tokentemp !== null) {
		this.tokentemp = params.tokentemp;
	}
	if ( params.username !== null) {
		this.emailuser = params.username;
	}
	this.type = "text";
	this.show = false;
});
	}

  ngOnInit() {
  }

	/*
  Metodo de validacion para las contraseñas del usuario
  */
	public getPassword(passOne: string, passTwo: string) {
    if (passOne === passTwo) {
      this.password = passOne;
      this.isPassOk = true;
    } else {
      this.isPassOk = false;
    }
  }

	/*
  funcion para hacer el cambio de contraseña desde el landignpage
  */
  public recoverPass() {
    if (this.isPassOk) {
      this.passwordRecovery = new PasswordRecovery(this.emailuser, this.tokentemp, this.password);
      this.publicService.recoverPass(this.passwordRecovery).subscribe( () => {
        this.messageSuccess = 'Se actualizo la contraseña correctamente';
        this.login = new Login(this.emailuser, this.password);
        this.publicService.login(this.login.username, this.login.password).subscribe( data => {
          this.token = data.token;
          localStorage.setItem('token', this.token);
          this.userService.getUser(this.login.username).subscribe( resdata => {
            const identity = resdata;
            localStorage.setItem('identity', JSON.stringify(identity));
            this.router.navigate(['/consoleuser']);
          });
        });
      }, error => {
        this.messageError = error;
      });
    }
  }

	showPass() {
    this.show = !this.show;
    if (this.show) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

}
