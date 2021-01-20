import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as Secure from 'secure-random-password';
import { SimpleGlobal } from 'ng2-simple-global';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import Swal from 'sweetalert2';

import { CommonService, DtOptions } from '@mat-libreta/shared';

import { RequestService } from '../services/requests.service';

@Component({
  selector: 'mat-libreta-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

	excelData: any[] = [];
	invalidEmails: any[] = [];
	loading: boolean = false;
	dataTable: any[] = [];
	dtOptions = DtOptions;
	tableHeader: string[];
	courses: string[] = [];
	fullCourses: any[] = [];
	groups: any[] = [];
	orgUnits: any[] = [];
	allOUs: any[] = [];
	processingStudents: boolean = false;
	processingGroups: boolean = false;
	errors: any[] = [];
	errorGroups: any[] = [];
	progress: string = '0';
	progressStyle: string = 'width: 0%;';
	progressColor: string = 'bg-success';
	progressTotal: number = 100;
	orgName: string;
	finished: boolean = false;
	exportAsConfig: ExportAsConfig = {
		type: 'xlsx',
		elementIdOrContent: ''
	}

  constructor(
		private commonService: CommonService,
		private requestService: RequestService,
		private sg: SimpleGlobal,
		private exportAsService: ExportAsService
	) {
		this.tableHeader = [
			'Nombre',
			'Apellidos',
			'Correo',
			'Password',
			'Plantel',
			'Id',
			'Errores'
		];
	}

  ngOnInit(): void {
		// console.log(this.sg['environment']);
		this.orgName = this.sg['environment'].orgName;
		this.getCourses();
		this.getOUs();
  }

	reset() {
		this.excelData = [];
		this.invalidEmails = [];
		this.courses = [];
		this.fullCourses = [];
		this.groups = [];
		this.orgUnits = [];
		this.processingStudents = false;
		this.processingGroups = false;
		this.errors = [];
		this.errorGroups = [];
		this.finished = false;
		this.exportAsConfig = {
			type: 'xlsx',
			elementIdOrContent: ''
		}
		$('#file').val('');
	}

	onFileChange(event:any) {
		this.commonService.displayLog('File Event trigger','Success');
		const target: DataTransfer = <DataTransfer>(event.target);
		if(target.files.length !== 1) {
			Swal.fire({
				type: 'error',
				text: 'Solo puede procesarse un archivo a la vez'
			});
			return;
		}
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			/* Leer el archivo */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			/* Traemos la primera hoja (sheet) */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

			/* Listo... tenemos los datos */
			this.excelData = convertToArray(XLSX.utils.sheet_to_json(ws,{header:1}));
			this.invalidEmails = filterErrors(this.excelData);
			this.courses = getCourses(this.excelData);
			console.log(this.courses);
			this.groups = [];
			this.orgUnits = getOrgUnits(this.excelData);
			// console.group('Loop de cursos');
			for(let course of this.courses) {
				let foundCourse = this.fullCourses.find(r => r.code === course);
				// console.group('foundCourse');
				// console.log(course);
				// console.log(foundCourse);
				// console.groupEnd();
				for(let ou of this.orgUnits) {
					let findOu = this.allOUs.find(o => o.name === ou);
					const thisStudents = this.excelData.filter(item => item.char1 === course && item.orgUnit === ou);
					const thisCourse = thisStudents[0].course;
					const students = cleanStudents(thisStudents);
					this.groups.push({
						course: {
							name: foundCourse ? foundCourse.title : 'Error',
							code: foundCourse ? foundCourse.code: course,
							_id: foundCourse ? foundCourse._id: null,
							beginDate: thisCourse.beginDate,
							endDate: thisCourse.endDate,
							minGrade: thisCourse.minGrade,
							minTrack: thisCourse.minTrack,
							instructor: thisCourse.instructor
						},
						ou: findOu || {error: `No existe plantel con clave ${ou}`},
						students: [...students],
						results: {
							error: false
						},
						status: 'draft'
					});
				}
			}
			this.errorGroups = this.groups.filter(c => c.course.name === 'Error' || c.ou.error);
			this.groups = this.groups.filter(r => r.students.length > 0);
			// console.groupEnd();
			this.commonService.displayLog('Excel',this.excelData);
			this.commonService.displayLog('Errores',this.invalidEmails);
			this.commonService.displayLog('Courses', this.courses);
			this.commonService.displayLog('OrgUnits', this.orgUnits);
			this.commonService.displayLog('Groups', this.groups);
			this.commonService.displayLog('errorGroups', this.errorGroups);
		};
		reader.readAsBinaryString(target.files[0]);
	}

	getCourses() {
		this.loading = true;
		this.fullCourses = [];
		this.requestService.getCourses().subscribe(data => {
			if(data.length > 0) {
				this.fullCourses = [...data];
			}
			this.commonService.displayLog('All Courses',this.fullCourses);
			this.loading = false;
		}, error => {
			console.log(error);
			this.loading = false;
		})
	}

	getOUs() {
		this.allOUs = [];
		this.requestService.getMyOU().subscribe(data => {
			const ou = data;
			if(ou.type === 'state') {
				this.requestService.getOUs(ou.name).subscribe(data => {
					this.allOUs = [...data];
					this.commonService.displayLog('All OUs', this.allOUs);
				}, error => {
					console.log(error);
				})
			} else {
				this.allOUs = [ou];
				this.commonService.displayLog('All OUs', this.allOUs);
			}

		}, error => {
			console.log(error);
		});
	}

	initiate() {
		Swal.fire({
			type: 'question',
			text: 'Confirma proceso de carga y generación de grupos',
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Proceder',
			confirmButtonColor: 'green',
			cancelButtonColor: 'red'
		}).then(results => {
			if(results.value) {
				this.registerUser(0);
			}
		});
	}

	// registerGroups(index:number) {
	// 	if(this.groups[index]) {
	// 		let group = this.groups[index];
	// 		let len = this.groups.length;
	// 		this.registerUser(index,0);
	// 	}
	// }

	registerUser(index:number) {
		this.processingStudents = true;
		this.progressTotal = this.excelData.length;
		if(this.excelData[index]) {
			if(this.excelData[index].validEmail) {
				let itr = this.excelData[index];
				let len = this.excelData.length;
				this.requestService
					.muir(itr)
					.subscribe(data => {
						if(data.userid) {
							this.excelData[index].userid = data.userid;
						}
						if(data.message && data.message.includes('Usuario previamente')) {
							this.excelData[index].password = '---'
						}
						this.progress = index + 1 + '';
						let width = Math.floor((index+1)*100/len);
						this.progressStyle = `width: ${width}%;`;
						this.registerUser(index+1);
					}, error => {
						this.progress = index +'';
						let width = Math.floor(index*100/len);
						this.progressStyle = `width: ${width}%;`;
						this.errors.push({
							user: itr.name,
							error: error.message
						});
						this.registerUser(index+1);
					});
			} else {
				this.registerUser(index + 1);
			}
		} else {
			// this.commonService.displayLog('ExcelData',this.excelData);
			this.mergeIDs();
			this.getGroups(0);
			this.commonService.displayLog('Groups',this.groups);
		}
	}

	mergeIDs() {
		this.groups.forEach(group => {
			group.students.forEach(student => {
				let foundStudent = this.excelData.find(r => r.name === student.name);
				if(foundStudent) student.userid = foundStudent.userid;
				if(foundStudent) student.password = foundStudent.password
			});
		});
		this.processingStudents = false;
	}

	getGroups(index:number) {
		this.processingGroups = true;
		this.progressTotal = this.groups.length;
		if(this.groups[index]) {
			if(this.groups[index].course.name !== 'Error') {
				this.requestService.getGroups(
					this.groups[index].ou._id,
					this.groups[index].course._id
				).subscribe(data => {
					// console.log(data);
					this.commonService.displayLog('GetGroups',data);
					this.groups[index].last = getLastNumber(data);
					this.getGroups(index + 1);
				}, error => {
					console.log(error);
					Swal.fire({
						type: 'error',
						text: 'Hubo un error en la comunicación al servidor'
					})
					return;
				})
			} else {
				this.getGroups(index + 1);
			}
		} else {
			this.createGroups(0);
		}
	}

	createGroups(index:number) {
		this.progressTotal = this.groups.length;
		if(this.groups[index]) {
			let len = this.groups.length;
			const thisGroup = this.groups[index];
			const groupCode = `${thisGroup.course.code}-${thisGroup.ou.name}-${thisGroup.last}`;
			const groupName = `${thisGroup.course.name} ${thisGroup.ou.name} ${thisGroup.last}`;
			const group = {
				code: groupCode,
				name: groupName,
				course: thisGroup.course._id,
				org: this.orgName,
				orgUnit: thisGroup.ou._id,
				instructor: thisGroup.course.instructor,
				beginDate: thisGroup.course.beginDate,
				endDate: thisGroup.course.endDate,
				minGrade: thisGroup.course.minGrade,
				minTrack: thisGroup.course.minTrack
			}
			this.commonService.displayLog('Este es el grupo a cargar',group);
			this.requestService.createGroup(group).subscribe(data => {
				this.groups[index].results = {
					groupCode,
					groupName,
					error: false,
					results: data
				}
				this.groups[index]._id = data._id;
				this.progress = index + 1 + '';
				let width = Math.floor((index+1)*100/len);
				this.progressStyle = `width: ${width}%;`;
				this.createGroups(index +1);
			}, error => {
				console.log(error);
				this.progress = index + 1 + '';
				let width = Math.floor((index+1)*100/len);
				this.progressStyle = `width: ${width}%;`;
				this.groups[index].results = {
					groupCode,
					groupName,
					error: true,
					results: error
				}
				this.createGroups(index +1);
			})
		} else {
			this.modifyGroups(0);
		}
	}

	modifyGroups(index:number) {
		if(this.groups[index]) {
			if(this.groups[index].results.error) {
				this.modifyGroups(index + 1);
			} else {
				this.requestService
					.modifyGroup(this.groups[index]._id,{
						status: 'active'
					})
					.subscribe(data => {
						// console.log(data);
						if(data.message) {
							this.groups[index].modifyResults = {
								error: true,
								message: data.message
							}
						} else {
							this.groups[index].modifyResults = {
								error: false,
								message: ''
							}
							this.groups[index].status = data.status;
						}
						this.modifyGroups(index + 1);
					}, error => {
						this.groups[index].modifyResults = {
							error: true,
							message: error.message
						}
						this.modifyGroups(index + 1);
					});
			}
		} else {
			this.createRosters(0);
		}
	}

	createRosters(index:number) {
		if(this.groups[index]) {
			const group = this.groups[index];
			if(group.results.error || group.modifyResults.error) {
				this.createRosters(index + 1);
			} else {
				if(group.status !== 'active') {
					this.createRosters(index +1);
				}
				const students = group.students.map(st => st.userid);
				// console.group('Students to send');
				// console.log(students);
				// console.groupEnd();
				if(students.length === 0) {
					this.createRosters(index + 1);
				}
				this.requestService.createRosters(group._id,students).subscribe(data => {
					// console.log(data);
					if(data.message) {
						this.groups[index].rosterResults = {
							error: true,
							message: data.message
						}
					} else {
						this.groups[index].rosterResults = {
							error: false,
							message: data
						}
					}
					this.createRosters(index + 1);
				}, error => {
					console.log(error);
					this.groups[index].rosterResults = {
						error: true,
						message: error.message
					}
					this.createRosters(index + 1);
				});
			}
		} else {
			this.commonService.displayLog('Resultado de la carga de grupos',this.groups);
			this.processingGroups = false;
			this.finished = true;
		}
	}

	export(index:number) {
		if(this.groups[index]) {
			this.exportAsConfig = {
				type: 'xlsx',
				elementIdOrContent: `group-${index}`
			}
			this.exportAsService.save(this.exportAsConfig, `${this.groups[index].results.groupCode}`).subscribe(() => {
				this.export(index + 1);
			});
		}
	}


}

function convertToArray(arr:any) {
	// const len = arr.length;
	// console.log(arr);
	// var returnedArray = [];
	// for(let i=1;i<len;i++) {
	// 	if(arr[i].length > 0) {
	// 		returnedArray.push({
	// 			[arr[0][0]]: arr[i][0].toUpperCase(),
	// 			[arr[0][1]]: arr[i][1].toLowerCase()
	// 		})
	// 	}
	// }
	// return returnedArray;
	if(!Array.isArray(arr)) return arr;
	arr = cleanXLS(arr);
	const header = arr[0];
	// console.log(header);
	arr = arr.slice(0,0).concat(arr.slice(1,arr.length));
	// console.log(arr);
	var returnedArray = [];
	for(let i=0; i< arr.length; i++) {
		let obj = {};
		if(arr[i].length > 0) {
			for(let j=0; j < arr[i].length; j++) {
				// console.log(arr[i][j]);
				if(arr[i][j] && header[j]) {
					if(typeof arr[i][j] !== 'string') arr[i][j] += '';
					obj[header[j]] = arr[i][j].trim();
				}
			}
			returnedArray.push(drawObject(obj));
		}
	}
	return returnedArray;
}

function drawObject(obj:any) {
	let email = obj.email.toLowerCase();
	let pass = obj.password || generatePassword();
	let today = new Date();
	let endDate = addDays(today,60);
	let todayString = `${today.getFullYear()}-${today.getMonth() + 1 + ''.padStart(2,'0')}-${today.getDay() + ''.padStart(2,'0')}`;
	let endDateString = `${endDate.getFullYear()}-${endDate.getMonth() + 1 + ''.padStart(2,'0')}-${endDate.getDay() + ''.padStart(2,'0')}`;
	return {
		name: email,
		validEmail: isValidEmail(email),
		org: obj.org,
		orgUnit: obj.orgUnit,
		char1: obj.courseCode,
		char2: '',
		password: pass,
		report: true,
		admin: {
			initialPassword: pass,
			adminCreate: true
		},
		person: {
			name: properCase(obj.name),
			fatherName: properCase(obj.fatherName),
			motherName: properCase(obj.motherName),
			email: obj.email.toLowerCase()
		},
		student: {
			type: obj.studentType.toLowerCase() || 'student',
			isActive: true
		},
		corporate: {
			type: obj.corpType.toLowerCase() || 'internal'
		},
		course: {
			code: obj.courseCode,
			minGrade: +obj.minGrade || 60,
			minTrack: +obj.minTrack || 70,
			beginDate: obj.beginDate || todayString,
			endDate: obj.endDate || endDateString,
			instructor: obj.instructor
		}
	};
}

function properCase(s:string) {
	if(typeof s !== 'string') return s;
	var word = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
	let arr = word.trim().split(' ');
	if(Array.isArray(arr) && arr.length > 1) {
		// console.log(word);
		let simpleWord = '';
		for(let w of arr) {
			simpleWord += ' ' + properCase(w);
		}
		word = simpleWord.trim();
		// console.log(word);
	}
	// console.log(word);
	if(word === '' || !word) return '.';
	return word;
}

function isValidEmail(email:string) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function filterErrors(arr:any) {
	if(!Array.isArray(arr)) return arr;
	return arr.filter(item => !item.validEmail);
}

function generatePassword() {
	return Secure.randomPassword({
		length: 12,
			characters: [{
				characters: Secure.upper,
				exactly: 4
			},{
				characters: Secure.symbols,
				exactly: 0
			},{
				characters: Secure.digits,
				exactly: 2
			},
			Secure.lower
			]
	});
}

function getCourses(arr:any) {
	if(!Array.isArray(arr)) return arr;
	return [... new Set(arr.map(item => {
		return item.char1;
	}))];
}

function getOrgUnits(arr:any) {
	if(!Array.isArray(arr)) return arr;
	return [... new Set(arr.map(item => {
		return item.orgUnit;
	}))];
}

function getLastNumber(arr:any) {
	if(!Array.isArray(arr)) return arr;
	if(arr.length === 0) {
		return '001';
	}
	let codes = arr.map(r => r.code).map(r => r.split('-').slice(-1)[0]);
	codes = codes.sort();
	// console.log(codes);
	return getLast(codes,-1);
}

function getLast(arr:any, index:number) {
	// console.log(arr);
	// console.log(index);
	let [last] = arr.slice(index);
	// console.log(last);
	if(!last) return 0;
	if(isNaN(last) && isValidIndex(arr,index-1)){
		getLast(arr,index-1);
	}
	if(isNaN(last)) {
		last = 0;
	}
	last = +last;
	last ++;
	last = last + '';
	return last.padStart(3,'0');
}

function isValidIndex(arr:any, index:number) {
	if(!Array.isArray(arr)) return false;
	if(typeof index !== 'number') return false;
	const length = arr.length;
	const absolutIndex = Math.abs(index);
	if(absolutIndex > length) return false;
	return true;
}

function addDays(date:Date = new Date(), days:number = 0){
	const newDay = new Date(Number(date));
	newDay.setDate(date.getDate() + days);
	return newDay;
}

function cleanXLS(arr:any) {
	if(!Array.isArray(arr)) return arr;
	return arr.filter(a => a.length > 0);
}

function cleanStudents(arr:any) {
	if(!Array.isArray(arr)) return arr;
	var newArr = [];
	for(let a of arr) {
		const { course, ...newA} = a;
		newArr.push(newA);
	}
	return newArr;
}
