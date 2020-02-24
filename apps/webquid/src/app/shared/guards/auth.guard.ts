import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as jwt from 'jwt-decode';

import { UserService } from '@crmshared/services/user.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

	token: string;

	constructor(
		private userService: UserService,
		private router: Router
	) {
	}

	canActivate(route: ActivatedRouteSnapshot,
		router: RouterStateSnapshot):
			boolean | UrlTree |
			Promise<boolean | UrlTree> |
			Observable<boolean | UrlTree>{
		this.token = this.userService.getToken()
		if(this.token) {
			try {
				const minDays = 2;
				const tokenDecoded: any = jwt(this.token);
				const oneDay = 24 * 60 * 60 * 1000;
				var exp = new Date();
				const now = new Date();
				exp.setMilliseconds(tokenDecoded.exp);
				var diffDays = Math.round(Math.abs((exp.getTime() - now.getTime())/oneDay));
				if(diffDays > minDays) {
					return true;
				} else {
					console.log(`Te quedan ${diffDays} de expiración... mejor ve a login`);
					return this.router.createUrlTree(['/pages/login']);
				}
			} catch (err) {
				return this.router.createUrlTree(['/pages/login']);
			}
		} else {
			return this.router.createUrlTree(['/pages/login']);
		}

	}
}
