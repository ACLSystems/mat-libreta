import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from './user.service';
import { CommonService } from './common.service';
import { JSONHeaders } from './httpHeaders';

@Injectable({
	providedIn: 'root'
})
export class UserCourseService {

	url							: string;
	instanceName		: string;
	token						: string;
	resultQueryCours: any[];
	idRQ						: string;

	constructor(
		public http: HttpClient,
		private userService: UserService,
		private commonService: CommonService
	) {
		this.url = this.commonService.getEnvironment().url;
		this.instanceName = this.commonService.getEnvironment().instanceName;
		this.token = this.userService.getToken();
	}

	getCourses():Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			)
		};
		const route = this.url+'api/v1/user/mygroups';
		return this.http.get(route, httpOptions);
	}

	getCoursesOrg():Observable<any>{
		const httpOptions = {
			params: new HttpParams().set(
				'org', this.instanceName
			)
		}
		const route = this.url+'api/course/list';
		return this.http.get(route,httpOptions);
	}

	enroll(courseid:string):Observable<any>{
		const params = JSON.stringify({
			courseid
		});
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			);
		const route = this.url+'api/v1/user/enroll';
		return this.http.post(route, params, {headers});
	}

	/*
	funcion para mostrar el listado del temario en base al track
	*/

	myGroup(id:string,rosterType?:string):Observable<any>{
		var param = (!rosterType || rosterType === 'group') ? 'groupid' : 'rosterid';
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams().set(
				param, id
			)
		};
		const route = this.url+'api/v1/user/mygroup';
		return this.http.get(route,httpOptions);
	}

	/*
	Método para traer información del bloque (nextBlock)
	*/

	getNextBlock(
		rosterType: string,
		id:string,
		blockid:string,
		lastid?:string):Observable<any> {
		var param = (!rosterType || rosterType === 'group') ? 'groupid' : 'rosterid';
		var params = {};
		if(lastid) {
			params = new HttpParams().set(
				param, id
			).set(
				'blockid', blockid
			).set(
				'lastid', lastid
			)
		} else {
			params = new HttpParams().set(
				param, id
			).set(
				'blockid', blockid
			)
		}
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: params
		};
		const route = this.url+'api/v1/user/nextblock';
		return this.http.get(route,httpOptions);
	}

	/*
  guardar las calificaciones del alumno en el mongodb
  */
  setAttempt(
		rosterType: string,
		id: string,
		blockid: string,
		answers: any[],
		grade: number
	):Observable<any>{
		const params = rosterType=='group' ?
		JSON.stringify({
			groupid: id,
			blockid: blockid,
			answers: answers,
			grade: grade
		}) :
		JSON.stringify({
			rosterid: id,
			blockid: blockid,
			answers: answers,
			grade: grade
		});
		const headers = JSONHeaders.set(
			'Authorization',
			'Bearer ' + this.commonService.getToken()
		);
		const route = this.url+'api/v1/user/createattempt';
    return this.http.put(route, params, {headers});
  }

	/*
	Metodo para obtener los recursos de un curso
	*/
	getResources(rosterType: string,id:string):Observable<any>{
		const param = (rosterType == 'group') ? 'groupid' : 'rosterid';
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams().set(
				param, id
			)
		};
		const route = this.url+'api/v1/user/getresource';
		return this.http.get(route,httpOptions);
	}

	/*
	listar los avisos de los cursos
	*/
	getAnnouncementCourse(courseid:string, groupid:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams()
				.set('query', JSON.stringify({
					course: courseid,
					group: groupid,
					pubtype: "announcement",
					type:"root"
				}))
				.set('order','-1')
				.set('skip','0')
				.set('limit', '500')
		};
		const route = this.url+'api/v1/user/comment/get';
		return this.http.get(route,httpOptions);
	}

	/*
	obtener las respuestas en la pestaña de dudas y preguntas de los bloques
	*/
	getReplysCourses(courseid:string,groupid:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams()
				.set('query', JSON.stringify({
					course: courseid,
					group: groupid,
					pubtype: "discussion",
					type:"reply"
				}))
				.set('order','-1')
				.set('skip','0')
				.set('limit', '500')
		};
		const route = this.url+'api/v1/user/comment/get';
		return this.http.get(route,httpOptions);
	}

	/*
	obtener los comentarios en la pestaña de dudas y preguntas de los cursos
	*/
	getCommentsCourses(courseid:string, groupid:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams()
				.set('query', JSON.stringify({
					course: courseid,
					group: groupid,
					pubtype: "discussion",
					type:"comment"
				}))
				.set('order','-1')
				.set('skip','0')
				.set('limit', '500')
		};
		const route = this.url+'api/v1/user/comment/get';
		return this.http.get(route,httpOptions);
	}

	/*
	listar las dudas y comentarios de los cursos
	*/
	getDiscussionCourse(courseid:string, groupid:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams()
				.set('query', JSON.stringify({
					course: courseid,
					group: groupid,
					pubtype: "discussion",
					type:"root"
				}))
				.set('order','-1')
				.set('skip','0')
				.set('limit', '500')
		};
		const route = this.url+'api/v1/user/comment/get';
		return this.http.get(route,httpOptions);
	}

	/*
  Mostrar la información de avance en el curso al alumno
  */
  getMyGrades(rostertype: string,id:string):Observable<any>{
		const param = rostertype == 'group' ? 'groupid' : 'rosterid';
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams().set(
				param, id
			)
		};
		const route = this.url+'api/v1/user/mygrades';
    return this.http.get(route,httpOptions);
  }

	/*
  Metodo para obtener los datos de los usuario que obtuvieron su constancia
  */
  public getUserConst(rostertype: string,id:string):Observable<any>{
		const param = rostertype == 'group' ? 'groupid' : 'rosterid';
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams().set(
				param, id
			)
		};
		const route = this.url+'api/v1/user/tookcert';
    return this.http.get(route,httpOptions);
  }

	/*
	crear un tema para el foro de discusión
	*/
	setDiscusion(discusion:any):Observable<any>{
		const params = JSON.stringify(discusion);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			);
		const route = this.url+'api/v1/user/comment/create';
		return this.http.post(route, params, {headers});
	}

	/*
  comentar en un tema del foro de discusion
  */
  setReplytto(reply:any): Observable<any> {
    const params = JSON.stringify(reply);
		const headers = JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			);
		const route = this.url+'api/v1/user/comment/create';
    return this.http.post(route, params, {headers});
  }
}
