import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from './user.service';
import { CommonService } from '@cjashared/services/common.service';
import { JSONHeaders } from '@cjashared/services/httpHeaders';
import { environment } from '@cjaenv/environment';

@Injectable()
export class UserCourseService {

	public url: string;
	public token: string;
	public resultQueryCours: any[];
	public idRQ: string;

	constructor(
		public http: HttpClient,
		private userService: UserService,
		private commonService: CommonService
	) {
		this.url = environment.url;
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
				'org', environment.instanceName
			)
		}
		const route = this.url+'api/course/list';
		return this.http.get(route,httpOptions);
	}

	/*
	funcion para mostrar el listado del temario en base al track
	*/

	myGroup(id:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams().set(
				'groupid', id
			)
		};
		const route = this.url+'api/v1/user/mygroup';
		return this.http.get(route,httpOptions);
	}

	/*
	Método para traer información del bloque (nextBlock)
	*/

	getNextBlock(groupid:string,blockid:string,lastid?:string):Observable<any> {
		var params = {};
		if(lastid) {
			params = new HttpParams().set(
				'groupid', groupid
			).set(
				'blockid', blockid
			).set(
				'lastid', lastid
			)
		} else {
			params = new HttpParams().set(
				'groupid', groupid
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
		groupid: string,
		blockid: string,
		answers: any[],
		grade: number
	):Observable<any>{
		const params = JSON.stringify({
			groupid: groupid,
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
	getResources(groupid:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams().set(
				'groupid', groupid
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
  getMyGrades(groupid:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams().set(
				'groupid', groupid
			)
		};
		const route = this.url+'api/v1/user/mygrades';
    return this.http.get(route,httpOptions);
  }

	/*
  Metodo para obtener los datos de los usuario que obtuvieron su constancia
  */
  public getUserConst(groupid:string):Observable<any>{
		const httpOptions = {
			headers: JSONHeaders.set(
				'Authorization',
				'Bearer ' + this.commonService.getToken()
			),
			params: new HttpParams().set(
				'groupid', groupid
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
