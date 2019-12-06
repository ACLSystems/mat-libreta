import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Identity } from '@crmshared/types/user.type';

import { CommonService } from '@crmshared/services/common.service';
import { JSONHeaders } from '@crmshared/services/httpHeaders';
import { environment } from '@crmenv/environment';

//permitimos con este decorador inyectar a otras dependencias
@Injectable()
export class UserService{

	public url: string;
	public identity: Identity;
	public token: any;
	public tokenVersion: string;
	public roles: any;


	constructor(
		private http: HttpClient,
		private commonService: CommonService
	) {
		this.url = environment.url;
	}

	/*
	metodo para traer la identidad del usuario autenticado
	*/
	getidentity() {
		return this.commonService.getidentity();
		// const identity = JSON.parse(localStorage.getItem('identity'));
		// if (identity !== 'undefined') {
		// 	this.identity = identity;
		// } else {
		// 	this.identity = null;
		// }
		// return this.identity;
	}

	/*
	metodo para poner el token del usuario logueado donde el api lo requiera
	*/
	getToken() {
		return this.commonService.getToken();
		// const token = localStorage.getItem('token');
		// if (token !== 'undefined') {
		// 	this.token = token;
		// } else {
		// 	this.token = null;
		// }
		// return this.token;
	}

	updateIdentity(identity: Identity): Identity {
		return this.commonService.updateIdentity(identity);
	}

	/*
	método para eliminar datos de la sesión
	*/
	destroySession() {
		localStorage.removeItem('identity');
		localStorage.removeItem('token');
		localStorage.removeItem('tokenVersion');
		localStorage.clear();
		return;
	}

	/*
	metodo para poner el token del usuario logueado donde el api lo requiera
	*/
	getTokenVersion() {
		const tokenVersion = localStorage.getItem('tokenVersion');
		if (tokenVersion !== 'undefined') {
			this.tokenVersion = this.tokenVersion;
		} else {
			this.tokenVersion = null;
		}
		return this.tokenVersion;
	}

	/*
	Metodo para obtener los roles del usuario
	*/
	/*
	Falta validar qué sucede si no hay token. Debería mandarlo a login
	*/
	getRoles():Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = this.url+'api/v1/user/myroles';
		return this.http.get(route,httpOptions);
	}

	/*
	Método para crear usuario / Prospecto / Contacto
	*/
	createUser(user:any):Observable<any>{
		const params = JSON.stringify(user);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/sales/user';
		return this.http.post(route, params, {headers});
	}

	/*
	Método para crear usuario
	*/

	createAccount(org:any):Observable<any>{
		const params = JSON.stringify(org);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/sales/org';
		return this.http.post(route, params, {headers});
	}

	/*
	Método para crear notas para la cuenta
	*/

	createOrgNote(note:any):Observable<any>{
		const params = JSON.stringify(note);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/sales/orgnote';
		return this.http.post(route, params, {headers});
	}

	/*
	Método para crear notas para el usuario
	*/

	createUserNote(note:any):Observable<any>{
		const params = JSON.stringify(note);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/sales/usernote';
		return this.http.post(route, params, {headers});
	}

	/*
	Método para revisar código postal
	*/

	getPostalCode(code:string):Observable<any>{
		const route = 'https://api-codigos-postales.herokuapp.com/v2/codigo_postal/' + code;
		return this.http.get(route);
	}

	/*
	Método para validar existencia de usuario
	*/

	checkUserExistence(user:string):Observable<any>{
		const route = this.url+'user/' + user;
		return this.http.get(route);
	}

	/*
	Método para validar existencia de cuenta
	*/

	checkOrgExistence(org:string):Observable<any>{
		const route = this.url+'org/' + org;
		return this.http.get(route);
	}

	/*
	Método para traer la lista de cuentas
	*/

	orgList():Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = this.url+'api/v1/sales/orgs';
		return this.http.get(route,httpOptions);
	}

	/*
	Método para traer la lista de dueños
	*/

	ownerList():Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = this.url+'api/v1/sales/owners';
		return this.http.get(route,httpOptions);
	}

	/*
	Método para traer la lista de usuarios
	*/

	usersList():Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = this.url+'api/v1/sales/users';
		return this.http.get(route,httpOptions);
	}

	/*
	Método para traer los detalles de un usuario
	*/

	getUser(userid:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = this.url+'api/v1/sales/user/' + userid;
		return this.http.get(route,httpOptions);
	}

	/*
	Método para modificar propiedades de un usuario
	*/

	modifyUser(user:any):Observable<any>{
		const params = JSON.stringify(user);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/sales/user';
		return this.http.patch(route, params, {headers});
	}

	/*
	Método para traer los detalles de una cuenta
	*/

	getAccount(orgid:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = this.url+'api/v1/sales/org/' + orgid;
		return this.http.get(route,httpOptions);
	}

	/*
	Método para modificar propiedades de una cuenta
	*/

	modifyAccount(org:any):Observable<any>{
		const params = JSON.stringify(org);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/sales/org';
		return this.http.patch(route, params, {headers});
	}

	/*
	Método para traer los detalles de una cuenta
	*/

	getTags():Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
		const route = this.url+'api/v1/sales/tags';
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
		const params = JSON.stringify(newpassword);
		const headers = JSONHeaders.set(
			'Authorization',
			'Bearer ' + this.getToken()
		);
		const route = this.url+'api/v1/user/passwordchange';
		return this.http.put(route, params, {headers});
	}

	/*
	metodo para devolver el total de notificaciones nuevas
	*/
	getNotifications():Observable<any>{
		const headers = JSONHeaders.set(
			'Authorization',
			'Bearer ' + this.getToken()
		);
		const route = this.url+'api/v1/user/message/new';
		return this.http.get(route, {headers});
	}

	/*
	metodo para devolver el total de notificaciones nuevas
	*/
	getUserImage():Observable<any>{
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
		const params = JSON.stringify(file);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/user/image';
		return this.http.post(route, params, {headers});
	}

	/*
	metodo para obtener mis notificaciones
	*/
	getMyNotificationsBell(): Observable<any> {
		const httpOptions = {
			params: new HttpParams()
				.set('read','false'),
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		}
		const route = this.url+'api/v1/user/message/my';
		return this.http.get(route, httpOptions);
	}

	/*
	metodo para obtener mis notificaciones
	*/
	getMyNotifications():Observable<any>{
		const headers = JSONHeaders.set(
			'Authorization',
			'Bearer ' + this.getToken()
		);
		const route = this.url+'api/v1/user/message/my';
		return this.http.get(route, {headers});
	}

	/*
	metodo para agregar una notificacion
	*/
	setNotification(message:any):Observable<any>{
		const params = JSON.stringify(message);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/user/message/create';
		return this.http.post(route, params, {headers});
	}

	/*
	metodo para cerrar notificaciones
	*/
	closeNotification(notificationid:any):Observable<any>{
		const params = JSON.stringify(notificationid);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			);
		const route = this.url+'api/v1/user/message/close';
		return this.http.put(route, params, {headers});
	}

	/*
	crear un follos a determinado elemento
	*/
	setFollow(follow:any):Observable<any>{
		const params = JSON.stringify(follow);
		const headers = JSONHeaders.set(
			'Authorization',
			'Bearer ' + this.getToken()
		);
		const route = this.url+'api/v1/user/follow/create';
		return this.http.post(route, params, {headers});
	}

	/*
	quitar el follos a determinado elemento
	*/
	quitFollow(followid: any):Observable<any> {
		const params = JSON.stringify(followid);
		const headers = JSONHeaders.set(
			'Authorization',
			'Bearer ' + this.getToken()
		);
		const route = this.url+'api/v1/user/follow/delete';
		return this.http.put(route, params, {headers});
	}
	/*
	metodo para modificar los datos del usuario
	*/
	userModify(person: any):Observable<any> {
		const params = JSON.stringify(person);
		const headers = JSONHeaders.set(
			'Authorization',
			'Bearer ' + this.getToken()
		);
		const route = this.url+'api/v1/user/modify';
		return this.http.put(route, params, {headers});
	}

	/*
	metodo para solicitar clave de validación
	*/
	validateEmailWOPR():Observable<any> {
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
			)
		};
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
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
		);
		const route = this.url+'api/v1/user/confirmemail';
		return this.http.post(route, body, {headers});
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
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.getToken()
		);
		const route = this.url+'api/v1/user/validatemaindata';
		return this.http.post(route, body, {headers});
	}
}
