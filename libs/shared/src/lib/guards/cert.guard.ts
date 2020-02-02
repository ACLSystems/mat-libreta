import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CertGuard implements CanActivate {

	constructor(
		private router: Router
	) {}

	canActivate(
		route: ActivatedRouteSnapshot
	): boolean | UrlTree |
		Promise<boolean | UrlTree> |
		Observable<boolean | UrlTree>{
			const groupid = route.params.groupid;
			// console.group('Guard Parametro');
			// console.log(groupid);
			// console.groupEnd();
			if(groupid) {
				const cert = JSON.parse(localStorage.getItem('cert'));
				if(cert && cert.groupid && cert.groupid === groupid && cert.status && cert.status == 'active') {
					return true;
				} else {
					localStorage.removeItem('cert');
					return this.router.createUrlTree(['/user/progress', groupid]);
				}
			} else {
				return this.router.createUrlTree(['/dashboard']);
			}
	}

}
