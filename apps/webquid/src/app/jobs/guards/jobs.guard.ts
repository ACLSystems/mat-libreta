import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Identity } from '@wqshared/types/user.type';
import { UserService } from '@wqshared/services/user.service';

@Injectable({providedIn: 'root'})
export class JobGuard implements CanActivate {

	identity: Identity;

	constructor(
		private userService: UserService,
		private router: Router
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		router: RouterStateSnapshot
	):
		boolean |
		UrlTree |
		Promise<boolean|UrlTree> |
		Observable<boolean|UrlTree> {
		this.identity = this.userService.getidentity();
		if(this.identity && this.identity.roles && (this.identity.roles.isRequester || this.identity.roles.isOperator)) {
			// console.log('Sí eres Solicitante!!!')
			return true;
		} else {
			return this.router.createUrlTree(['/dashboard']);
		}
	}
}
