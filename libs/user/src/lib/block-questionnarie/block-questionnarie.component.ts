import { Component, OnInit, OnChanges, Input, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import {
	Block,
	Questionnarie,
	Question,
	Response,
	QuestionService,
	UserCourseService
} from '@mat-libreta/shared';

@Component({
	selector: 'app-block-questionnarie',
	templateUrl: './block-questionnarie.component.html',
	styleUrls: ['./block-questionnarie.component.scss'],
	providers: [QuestionService]
})
export class BlockQuestionnarieComponent implements OnInit, OnDestroy {

	@Input() blockData:Block;
	@Input() id: string;
	@Input() blockid: string;
	@Input() rosterType: string;
	attempts: number;
	questionnarie: Questionnarie;
	responses: Response[] = [];
	subscription: Subscription;
	pointsPerQuestion: number[] = [];
	pointsObtained: number[] = [];
	questionsAnswered: number[] = [];
	totalPoints: number = 0;
	totalAnswered: number = 0;
	totalQuestions: number = 0;
	totalQuestionsAnswered: number = 0;
	blockGrade: number;
	blockGradedQ: boolean;
	blockGradedT: boolean;
	hideQuiz: boolean;



	constructor(
		private router: Router,
		private questionService: QuestionService,
		private userCourseService: UserCourseService
	) {

		this.subscription = this.questionService.getResponse
		.subscribe(response => {
			this.calculatePoints(response);
		});
	}

	ngOnInit() {
		console.group('block-questionnarie');
		console.log(this.blockData);
		console.groupEnd();
		// console.log(this.blockData);
		this.updateData();
	}

	updateData() {
		this.attempts = this.blockData.attempts;
		this.questionnarie = this.blockData.questionnarie;
		this.blockGrade = this.blockData.blockGrade;
		this.blockGradedQ = this.blockData.blockGradedQ;
		if(this.blockGradedQ) {
			this.hideQuiz = true;
		} else {
			this.hideQuiz = false;
		}
		// console.log('blockQuestionnarie');
		// console.log(this.questionnarie);
		// console.log(this.blockid);
		this.resetPoints();
		this.getMaxPoints();
	}

	ngOnChanges(changes: SimpleChanges) {
		this.blockData = (changes.blockData && !changes.blockData.firstChange) ? changes.blockData.currentValue : this.blockData;
		this.id = (changes.id && !changes.id.firstChange) ? changes.id.currentValue : this.id;
		this.rosterType = (changes.rosterType && !changes.rosterType.firstChange) ? changes.rosterType.currentValue : this.rosterType;
		this.blockid = (changes.blockid && !changes.blockid.firstChange) ? changes.blockid.currentValue : this.blockid;
		// console.log('changes');
		// if(changes.blockData) {
		// 	console.group('block-questionnaire');
		// 	console.log(this.blockData);
		// 	console.groupEnd();
		// }
		this.updateData();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	goExam() {
		this.router.navigate(['/exam',this.rosterType,this.id,this.blockid]);
	}

	validateResponses() {
		let htmlHeader = '<h2><i class="material-icons">warning</i> Atención</h2><hr>' +
		'<div class="text-primary">Al enviar tus respuestas aceptas el uso de uno de los intentos que tienes para realizar tu evaluación.</div>'
		let htmlWarning = '<div class="alert alert-warning alert-with-icon" data-notify="container">' +
		'<i class="material-icons" data-notify="icon">notifications</i>' +
		'<button mat-button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
		'<i class="material-icons">close</i>' +
		'</button>' +
		'<span data-notify="icon" class="now-ui-icons ui-1_bell-53"></span>' +
		'<span data-notify="message">' +
		`Has contestado <b class="text-dark">${this.totalQuestionsAnswered}</b> preguntas de <b class="text-dark">${this.totalQuestions}</b> que tiene este cuestionario.`+ '</span></div>';
		let htmlFooter = '<h2>¿Deseas continuar?</h4>';
		let html = htmlHeader;
		if(this.totalQuestionsAnswered < this.totalQuestions) {
			html += htmlWarning;
		}
		html += htmlFooter;
		if(this.totalQuestionsAnswered == 0) {
			Swal.fire({
				type: 'error',
				title: 'No has respondido ninguna pregunta',
				text: 'Solo podemos enviar cuestionarios con al menos una pregunta respondida'
			});
			return;
		}
		Swal.fire({
			html: html,
			showCancelButton: true,
			confirmButtonText: 'Continuar',
			cancelButtonText: 'Cancelar',
			cancelButtonColor: '#d33'
		}).then((result) => {
			if(result.value) {
				Swal.fire('Espera...');
				Swal.showLoading();
				let now = new Date();
				let grade = this.totalAnswered / this.totalPoints * 100;
				grade = Math.round((grade + 0.00001) * 100) / 100;
				this.userCourseService.setAttempt(this.rosterType,this.id, this.blockid, this.responses, grade).subscribe(data => {
					// console.log(data);
					Swal.hideLoading();
					Swal.close();
					let identity = JSON.parse(localStorage.getItem('identity'));
					let responseHeader = '<h2>Calificación</h1><hr>' +
					`Participante: <span class=text-primary>${identity.person.name} ${identity.person.fatherName} ${identity.person.motherName}</span><br>`;
					let responseBody =
					`Código de curso: <span class="text-primary">${this.blockData.courseCode}</span><br>` +
					`Lección: <span class="text-primary">${this.blockData.blockSection}.${this.blockData.blockNumber} ${this.blockData.blockTitle}</span><hr>`+
					`Total de aciertos: <span class="text-primary">${this.totalAnswered}</span>/${this.totalPoints}<br>` +
					`Calificación: <span class="text-primary">${grade}</span><hr>`;
					let months = [
						'Enero',
						'Febrero',
						'Marzo',
						'Abril',
						'Mayo',
						'Junio',
						'Julio',
						'Agosto',
						'Septiembre',
						'Octubre',
						'Noviembre',
						'Diciembre'
					];
					let responseFooter = `<small>${now.getDate()} de ${months[now.getMonth()]} del ${now.getFullYear()} &nbsp;  ${now.getHours()}:${now.getMinutes()} horas (Hora de la Cd. de México)</small>`
					Swal.fire({
						html: responseHeader +
						responseBody +
						responseFooter
					});
					this.hideQuiz = true;
				}, error => {
					console.log(error);
				});
			}
		})
		//this.questionService.printResults(true);
	}

	getMaxPoints() {
		if(this.questionnarie) {
			let questions: Question[] = this.questionnarie.questions;
			// console.log(questions);
			let totalQuestions = 0;
			if(questions.length > 0) {
				for(let i=0; i < questions.length; i++){
					if(questions[i].type === 'map' ||
					questions[i].type === 'group'){
						this.pointsPerQuestion[i] =  questions[i].group.length * questions[i].w;
						totalQuestions += questions[i].group.length;
					} else if (questions[i].type === 'option' || questions[i].type === 'tf') {
						this.pointsPerQuestion[i] = questions[i].w;
						totalQuestions++;
					} else {

					}
				}
				this.totalQuestions = totalQuestions;
				this.totalPoints = this.pointsPerQuestion.reduce((acc,cur) => {
					return acc + cur;
				});
				// console.log(this.pointsPerQuestion);
				// console.log(this.totalPoints);
			}
		}
	}

	resetPoints() {
		this.totalPoints = 0;
		for(let i=0; i < this.questionnarie.questions.length; i++) {
			this.pointsObtained[i] = 0;
			this.questionsAnswered[i]= 0;
		}
		this.questionnarie.questions.forEach(q => {
			this.responses.push({
				indexquestion: q.id,
				result: [],
				points: 0
			})
		})
		// console.log(this.pointsObtained);
		// console.log(this.questionsAnswered);
	}

	calculatePoints(response: Response) {
		var processedResponse = response;
		let sumPoints = 0;
		sumPoints = response.result.reduce((acc,cur) => {
			return acc + cur.points;
		},sumPoints);
		let sailing = true;
		let responseNumber = 0;
		while(sailing || responseNumber > response.result.length) {
			if(response.result[responseNumber]) {
				sailing = false;
			} else {
				responseNumber++;
			}
		}
		this.pointsObtained[response.result[responseNumber].indexquestion] = sumPoints;
		processedResponse.points = sumPoints;
		let responseFind = this.responses.findIndex(r => r.indexquestion === processedResponse.indexquestion);
		if(responseFind > -1) {
			this.responses[responseFind] = processedResponse;
		}
		let quest = 0;
		response.result.forEach(res => {
			if(res) {
				quest ++;
			}
		});
		this.questionsAnswered[response.result[responseNumber].indexquestion] = quest;
		// console.log('Recibiendo respuestas')
		// console.log(response);
		this.totalAnswered = this.pointsObtained.reduce((acc,cur) => {
			return acc + cur;
		});
		this.totalQuestionsAnswered = this.questionsAnswered.reduce((acc, cur) => {
			return acc + cur;
		})
		// console.log(this.questionsAnswered);
		// console.log(`Points ${this.totalAnswered} / ${this.totalPoints}. Questions responded: ${this.totalQuestionsAnswered} / ${this.totalQuestions}`);
		// console.log(this.responses);
		// console.log(sumPoints);
	}

	attemptQuiz () {
		Swal.fire({
			text: 'Se tomará como intento si eliges continuar',
			showCancelButton: true,
			confirmButtonText: 'Continuar',
			cancelButtonText: 'Cancelar',
			cancelButtonColor: '#d33'
		}).then((result) => {
			if(result.value) {
				this.hideQuiz = false;
				this.attempts++;
			}
		})
	}

}
