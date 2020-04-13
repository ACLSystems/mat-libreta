import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

import { RequesterService } from '../requester.service';
import { PublicService } from '@mat-libreta/shared';

import { environment } from '@cetecenv/environment';

interface User {
	id: number;
	userid?: string;
	token?: string;
	name: string;
	fatherName: string;
	motherName: string;
	email: string;
	course?: string;
	status?: string[];
}

interface Course {
	id: string,
	title: string,
	name: string
}

@Component({
	selector: 'mat-libreta-userpublic',
	templateUrl: './userpublic.component.html',
	styleUrls: ['./userpublic.component.scss']
})
export class UserpublicComponent implements OnInit {

	loading: boolean = false;
	users = new FormControl('');
	usersArray: User[] = [];
	usersPreprocessed: boolean = false;
	courses: Course[] = [];
	password = new FormControl('abc123');
	errors: boolean = false;
	processing: boolean = false;
	processed: number = 0;

	constructor(
		private requesterService: RequesterService,
		private publicService: PublicService
	) {
		this.loading = true;
		this.requesterService.getCourses().subscribe(data => {
			// console.log(data.message);
			if(data && data.message && data.message.courses && data.message.courses.length > 0) {
				let courses = data.message.courses.filter((course:any) => course.type === 'self-paced' && course.isVisible);
				this.courses = courses.map((course:any) => {
					return {
						id: course.id,
						title: course.title,
						code: course.code
					};
				});
				this.courses.sort((a,b) => (a.title > b.title) ? 1: -1);
			}
			// console.log(this.courses);
			this.loading = false;
		}, error => {
			console.log(error);
			Swal.fire({
				type: 'error',
				text: 'Hubo un error'
			});
			this.loading = false;
		});
	}

	ngOnInit(): void {
	}

	preProcessUsers() {
		let users = this.users.value;

		const regex = /[\n]/g;
		// const space = /[\s]/g;
		const email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/g;
		users = users.replace(regex,';');
		let usersTempArray = [];
		if(users !== ''){
			usersTempArray = users.split(';');
		}
		if(usersTempArray.length > 0){
			usersTempArray.forEach(user => {
				user = user.toLowerCase().trim();
				let keyData = user.split(',');
				let data = {
					id: keyData[0] || 'error',
					name: keyData[1] || 'error',
					fatherName: keyData[2] || 'error',
					motherName: keyData[3] || 'error',
					email: (keyData[4] && keyData[4].match(email)) ? keyData[4] : 'error',
					status: []
				}
				this.usersArray.push(data);
			});
			this.usersPreprocessed = true;
		} else {
			Swal.fire({
				type: 'warning',
				text: 'No hay usuarios para procesar'
			});
		}
	}

	addUserCourse(index:number, value:string) {
		this.usersArray[index].course = value;
		// console.log(this.usersArray);
	}

	reload() {
		this.usersPreprocessed = false;
		this.usersArray = [];
	}

	loadUsers() {
		if(this.password.value === '') {
			Swal.fire({
				type: 'error',
				text: 'Define el password que usarán los usuarios'
			});
			this.password.markAsDirty({ onlySelf: true});
			this.password.setErrors({required:true});
			return;
		}
		let error = false;
		// let allCourses = true;
		for(let user of this.usersArray) {
			let values = Object.values(user);
			if(values.includes('error')) {
				error = true;
			}
		}
		let courses = this.usersArray.map(user => user.course);
		courses = courses.filter(course => course);
		// console.log(courses)
		if(courses.length !== this.usersArray.length) {
			return Swal.fire({
				type: 'error',
				text: 'Revisa que todos los alumnos tengan seleccionado un curso'
			});
		}
		if(error) {
			return Swal.fire({
				type: 'error',
				text: 'Alguno de los usuarios tiene un error. Valida y corrige'
			});
		}
		let register = {};
		let users = [...this.usersArray];
		let password = this.password.value;
		this.processing = true;
		for(let i=0;i<users.length;i++) {
			let user = users[i];
			register = {
				name: user.email,
				password,
				person: {
					name: user.name,
					fatherName: user.fatherName,
					motherName: user.motherName,
					email: user.email
				},
				org: environment.instanceName,
				orgUnit: environment.orgUnitName
			}
			// console.log(register);
			this.publicService.register(register).subscribe(data => {
				if(data.userid) {
					this.usersArray[i].userid = data.userid;
					this.usersArray[i].status.push('Usuario creado');
					this.publicService.login(user.email,password).subscribe(data => {
						// console.log(data);
						this.usersArray[i].status.push('Ingresando como usuario correctamente');
						if(data.token) {
							this.usersArray[i].token = data.token;
							this.requesterService.enroll(user.course,this.usersArray[i].token).subscribe(data => {
								if(data.message && data.message.includes('Te has inscrito al curso')) {
									this.usersArray[i].status.push(data.message);
								} else {
									this.usersArray[i].status.push('No se recibió mensaje de inscripción');
								}
								this.processed = Math.floor(i / users.length) * 100;
							}, error => {
								console.log(error);
								this.usersArray[i].status.push(error.error);
							});
						}
					}, error => {
						console.log(error);
						this.usersArray[i].status.push(error.error);
					});
				}
			}, error => {
				console.log(error);
				this.usersArray[i].status.push(error.error);
			});
			if(i === users.length - 1) {
				this.processing = false;
			}
		}
	}

}
