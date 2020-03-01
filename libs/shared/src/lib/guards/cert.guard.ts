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
			const id = route.params.id;
			console.group('Guard Parametro');
			console.log(id);
			console.groupEnd();
			if(id) {
				const cert = JSON.parse(localStorage.getItem('cert'));
				if(cert && cert.id && cert.id === id && cert.status && cert.status == 'active') {
					return true;
				} else {
					localStorage.removeItem('cert');
					localStorage.setItem('certAttempt',JSON.stringify(true));
					return this.router.createUrlTree(['/user/progress', cert.rosterType, id]);
				}
			} else {
				return this.router.createUrlTree(['/dashboard']);
			}
	}

}
