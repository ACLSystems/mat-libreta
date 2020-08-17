import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { SimpleGlobal } from 'ng2-simple-global';

import { Identity } from '../types/user.type';
import { Roles } from '../types/user.type';

import { CommonService } from './common.service';
import { JSONHeaders } from './httpHeaders';

//permitimos con este decorador inyectar a otras dependencias
@Injectable({
	providedIn: 'root'
})
export class UserService{

	url: string;

	constructor(
		private http: HttpClient,
		private commonService: CommonService
		// private sg: SimpleGlobal
	) {
		this.url = localStorage.getItem('url');
		// this.commonService.getCurrentEnvironment.subscribe(() => {
		// 	const environment = this.commonService.getEnvironment();
		// 	if(environment && environment.url) this.url = environment.url;
		// });
	}

	/*
	metodo para obtener la informacion del usuario
	*/
	/*
	Falta validar que hacer si no hay token. Debería mandarlo a login
	*/
	getUser(username:string): Observable<any> {
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			),
			params: new HttpParams().set(
				'name', username
			)
		};
		const route = this.url + 'api/v1/user/getdetails';
		return this.http.get(route, httpOptions);
	}

	/*
	metodo para traer la identidad del usuario autenticado
	*/
	getidentity() {
		return this.commonService.getidentity();
	}

	/*
	metodo para poner el token del usuario logueado donde el api lo requiera
	*/
	getToken() {
		return this.commonService.getToken();
	}

	updateIdentity(identity: Identity): Identity {
		return this.commonService.updateIdentity(identity);
	}

	getHttpOptions() {
		return {
			headers: JSONHeaders.set(
				'Authorization',
				`Bearer ${this.getToken()}`
			)
		};
	}

	/*
	método para eliminar datos de la sesión
	*/
	destroySession() {
		localStorage.removeItem('token');
		localStorage.removeItem('identity');
		localStorage.removeItem('roles');
		localStorage.removeItem('courses');
		localStorage.clear();
		return;
	}

	getRoles(): Roles | null{
		var roles = JSON.parse(localStorage.getItem('roles'));
		if(roles) return roles;
		this.getRolesHTTP().subscribe(data => {
			roles = data.message;
			localStorage.setItem('roles',JSON.stringify(roles));
			return roles;
		}, error => {
			console.log(error);
			return null;
		});
	}

	getRolesHTTP():Observable<any>{
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/myroles';
		return this.http.get(route,httpOptions);
	}

	/*
	Metodo para imprimir los errores que se generen en API
	*/
	parserErrors(error:string):string{
		if(error.match("Not Found")){
			return "Usuario o contraseña invalido, favor de validar que los datos proporcionados sean las correctos";
		}
		return "Error desconocido";
	}

	/*
	funcion para el cambio de contraseña
	*/
	changePassword(newpassword:string){
		const params = JSON.stringify({password:newpassword});
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/passwordchange';
		return this.http.put(route, params, httpOptions);
	}

	/*
	metodo para devolver el total de notificaciones nuevas
	*/
	bell():Observable<any>{
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/message/new';
		return this.http.get(route, httpOptions);
	}

	/*
	metodo para devolver el total de notificaciones nuevas
	*/
	getNotification(notificationid: string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			),
			params: new HttpParams().set(
				'notificationid', notificationid
			)
		};
		const route = this.url+'api/v1/user/message';
		return this.http.get(route, httpOptions);
	}

	/*
	metodo para devolver el total de notificaciones nuevas
	*/
	getUserImage():Observable<any>{
		if(!this.url) {
			this.commonService.getCurrentEnvironment.subscribe(() => {
				this.url = this.commonService.getEnvironment().url;
			})
		}
		const headers = JSONHeaders.set(
			'Authorization',
			'Bearer ' + this.getToken()
		);
		const route = this.url+'api/v1/user/image';
		return this.http.get(route, {headers: headers, responseType: 'blob'});
	}

	/*
	metodo para devolver el total de notificaciones nuevas
	*/
	postUserImage(file:any):Observable<any>{
		// const params = JSON.stringify(file);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		// return this.http.post(route, params, {headers});
		const formData = new FormData();
		formData.append('file',file);
		// console.log('Lanzando archivo')
		// console.log(file);
		const req = new HttpRequest('POST', this.url+'api/v1/user/image', formData, {
			headers,
			reportProgress: true,
			responseType: 'json'
		});
		// console.log(req);
		return this.http.request(req);
	}

	/*
	metodo para obtener mis notificaciones
	*/
	getMyNotifications():Observable<any>{
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/message/my';
		return this.http.get(route,httpOptions);
	}

	/*
	metodo para agregar una notificacion
	*/
	setNotification(message:any):Observable<any>{
		const params = JSON.stringify(message);
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/message/create';
		return this.http.post(route, params,httpOptions);
	}

	/*
	metodo para cerrar notificaciones
	*/
	closeNotification(notificationid:string):Observable<any>{
		const params = JSON.stringify({notificationid});
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/message/close';
		return this.http.put(route, params,httpOptions);
	}

	/*
	crear un follos a determinado elemento
	*/
	setFollow(follow:any):Observable<any>{
		const params = JSON.stringify(follow);
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/follow/create';
		return this.http.post(route, params,httpOptions);
	}

	/*
	quitar el follos a determinado elemento
	*/
	quitFollow(followid: any):Observable<any> {
		const params = JSON.stringify(followid);
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/follow/delete';
		return this.http.put(route, params,httpOptions);
	}
	/*
	metodo para modificar los datos del usuario
	*/
	userModify(person: any):Observable<any> {
		const params = JSON.stringify(person);
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/modify';
		return this.http.put(route, params,httpOptions);
	}

	/*
	metodo para solicitar clave de validación
	*/
	validateEmailWOPR():Observable<any> {
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/valemailwopr';
		return this.http.get(route, httpOptions);
	}

	/*
	metodo para confirmar correo con clave de validación
	*/
	confirmEmail(code:string):Observable<any> {
		var body = {
			'emailID': code
		};
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/confirmemail';
		return this.http.post(route, body, httpOptions);
	}

	/*
	metodo para validar nombre del usuario
	*/
	validateUserMainData(identity:Identity):Observable<any> {
		var body = {
			'name': identity.person.name,
			'fatherName': identity.person.fatherName,
			'motherName': identity.person.motherName
		};
		const httpOptions = this.getHttpOptions();
		const route = this.url+'api/v1/user/validatemaindata';
		return this.http.post(route, body, httpOptions);
	}

	/*
	metodo logout
	*/
	logout(): Observable<any>|null {
		const httpOptions = this.getHttpOptions();
		const route = this.url + 'api/v1/user/logout';
		return this.http.post(route,{},httpOptions);
	}

	/*
	metodo logout All
	*/
	logoutAll(): Observable<any>|null {
		const httpOptions = this.getHttpOptions();
		const route = this.url + 'api/v1/user/logout';
		return this.http.post(route,{},httpOptions);
	}
}
