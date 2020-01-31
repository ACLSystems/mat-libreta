import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Chartist from 'chartist';
import Swal from 'sweetalert2';

import { Grade, BlockGrade } from '@mat-libreta/shared';

import {
	UserCourseService,
	WindowService
} from '@mat-libreta/shared';

declare const $: any;

interface dataChart {
	labels: string[],
	series: number[]
}

@Component({
	selector: 'app-progress',
	templateUrl: './progress.component.html',
	styleUrls: ['./progress.component.scss'],
	providers: [
		UserCourseService
	]
})
export class ProgressComponent implements OnInit {

	loading: boolean;
	groupid: string;
	grade: Grade;
	track: number;
	minTrack: number;
	rubricData: dataChart;
	totalW: number;
	totalPercentage: number;
	finalGrade: number;
	width: number;
	display: any[] = [];

	startAnimationForBarChart(chart: any) {
			let seq2: any, delays2: any, durations2: any;
			seq2 = 0;
			delays2 = 80;
			durations2 = 500;
			chart.on('draw', function(data: any) {
				if (data.type === 'bar') {
						seq2++;
						data.element.animate({
							opacity: {
								begin: seq2 * delays2,
								dur: durations2,
								from: 0,
								to: 1,
								easing: 'ease'
							}
						});
				}
			});

			seq2 = 0;
	}

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userCourseService: UserCourseService,
		private windowService: WindowService
	) {
		this.activatedRoute.params.subscribe(params => {
				this.groupid = params.groupid;
			}
		);
	}

	ngOnInit() {
		this.loading = true;
		this.width = this.windowService.windowRef.innerWidth;
		this.getGrades();
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		// console.log(event)
		this.width = this.windowService.windowRef.innerWidth;
		if(this.width > 768) {
			setTimeout(() => {
				this.displayChart();
			}, 100);
		}
	}

	getGrades() {
		console.group('Iniciando getGrades');
		console.log(this.display);
		console.groupEnd();
		this.userCourseService.getMyGrades(this.groupid).subscribe(data => {
			this.grade = data.message;
			console.group('Data');
			console.log(data);
			console.groupEnd();
			this.track = +this.grade.track.replace('%','');
			this.minTrack = +this.grade.minTrack.replace('%','');
			this.grade = this.generateDisplayValues(this.grade);
			this.loading = false;
			console.group('Grade');
			console.log(this.grade);
			console.groupEnd();
			if(this.width > 768){
				setTimeout(() => {
					this.displayChart();
				}, 300);
			}
		}, error => {
			Swal.fire({
				type: 'error',
				title: 'Error de comunicación con el servidor',
				text: 'El servidor nos respondió con un error. Puede ser temporal, por lo que te sugerimos intentar nuevamente en un minuto.',
				footer: 'En caso de que este error se presente continuamente, favor de reportarlo a soporte@soporte con este número de error: 1234'
			});
			console.log(error);
		});
	}

	displayChart() {
		var dataChartGrades: dataChart= {
			labels: [],
			series: []
		};
		var dataChartRubric: dataChart = {
			labels: [],
			series: []
		};
		var grades: BlockGrade[] = (this.grade.blocks && this.grade.blocks.length > 0) ? this.grade.blocks : [];
		console.group('grades for charting');
		console.log(grades);
		console.groupEnd();
		var rubricTotal = 0;
		if(grades.length > 0) {
			grades.forEach(grade => {
				if(grade.blockNumber === 0) {
					rubricTotal += grade.blockW;
				}
			});
		}
		if(grades.length > 0) {
			var i = 0;
			grades.forEach(grade => {
				if(grade.blockNumber === 0) {
					// console.log(grade);
					dataChartGrades.labels.push(grade.blockSection + '.-' + grade.blockTitle);
					if(rubricTotal > 0 ) {
						if(grades.length > 4) {
							dataChartRubric.labels.push('U'+ grade.blockSection + ': ' + (grade.blockW/rubricTotal)*100 + '%');
						} else {
							dataChartRubric.labels.push('Unidad '+ grade.blockSection + ': ' + (grade.blockW/rubricTotal)*100 + '%');
						}
					} else {
						dataChartRubric.labels.push('Unidad '+ grade.blockSection);
					}
					dataChartGrades.series.push(grade.grade);
					dataChartRubric.series.push(grade.blockW);
				}
				i++;
			});
		}
		var counts = [];
		for(let i=0; i < dataChartRubric.series.length; i++) {
			let serie = dataChartRubric.series[i];
			let label = dataChartRubric.labels[i];
			let found = counts.findIndex(c => c.number === serie);
			if(found > -1) {
				if(counts[found].label) {
					counts[found] = {
						number: serie,
						count: counts[found].count + 1,
						label: 'El resto de las unidades',
						acc: counts[found].acc + serie
					}
				} else {
					counts[found] = {
						number: serie,
						count: counts[found].count + 1,
						label: label,
						acc: serie
					}
				}

			} else {
				counts.push({
					number: serie,
					count: 1,
					label: label,
					acc: serie
				});
			}
		}
		var newDataChartRubric = {
			series: [],
			labels: []
		}
		counts.forEach(label => {
			newDataChartRubric.series.push(label.acc);
			newDataChartRubric.labels.push(label.label);
		})
		// console.log(counts);
		// console.log(dataChartRubric);
		// console.log(newDataChartRubric);
		this.rubricData = newDataChartRubric;
		// const dataChartTest = {
		// 	labels: ['U1', 'U2', 'U3','U4', 'U5', 'U6','U7', 'U8', 'U9','U10', 'U11'],
		// 	series: [
		// 		[7.40755555556,0,0,0,0,0,0,0,0,0,0]
		// 	]
		// };
		const optionsChart = {
			seriesBarDistance: 10,
			axisX: {
				showGrid: false
			},
			// height: '400px'
			high: 100,
			low: 0,
			chartPadding: {
				top: 15,
				right: 15,
				bottom: 50,
				left: 10
			},
			distributeSeries: true
		};

		const responsiveOptions: any = [
			['screen and (max-width: 640px)', {
				seriesBarDistance: 5,
				axisX: {
					labelInterpolationFnc: function (value: any) {
						return value[0];
					}
				}
			}]
		];

		console.group('DatachartGrades');
		console.log(dataChartGrades);
		console.groupEnd();
		console.group('DatachartRubric');
		console.log(dataChartRubric);
		console.groupEnd();
		const chartGrades = new Chartist.Bar('#chart-grades', dataChartGrades,optionsChart,responsiveOptions);
		this.startAnimationForBarChart(chartGrades);
		new Chartist.Pie('#chart-rubric',dataChartRubric,
			{
				startAngle: 180,
				height: '230px',
				showLabel: true
			});

		// setTimeout(() => {
		// 	const pie = document.getElementsByClassName('ct-label');
		// 	console.log(pie);
		// 	for(let i = 0; i < pie.length; i++) {
		// 		if(pie[i].nodeName == 'text') {
		// 			pie[i].removeAttribute('fill');
		// 		}
		// 	}
		// }, 500);

	}

	getBlock(blockid: string, track?: boolean, force?: boolean) {
		const courseid = this.grade.courseId;
		const groupid = this.groupid;
		if(track || force) {
			this.router.navigate(['/user/block', courseid, groupid, blockid]);
		}
	}

	private generateDisplayValues(grades: any) {
		console.group('Iniciando display Values');
		console.log(this.display);
		console.groupEnd();
		this.totalW = 0;
		this.totalPercentage = 0;
		this.finalGrade = 0;
		grades.blocks.forEach((value: any) => {
			// if(value.blockType === 'questionnarie') {
			// 	value.typeDisplay = 'Examen/Quiz';
			// } else if(value.blockType === 'task') {
			// 	value.typeDisplay = 'Actividad/Tarea';
			// } else {
			// 	value.typeDisplay = value.blockType;
			// }

			if(value.blockNumber === 0) {
				value.typeDisplay = 'Sección';
				this.totalW += value.blockW;
				let found = this.display.findIndex(obj => obj.section === value.blockSection);
				if(found > -1) {
					this.display[found].grade = value.grade;
					this.display[found].w = value.blockW;
					this.display[found].title = value.blockTitle;
					this.display[found].track = (value.track === 100) ? true : false;
				} else {
					this.display.push({
						id: value.blockId,
						section: value.blockSection,
						grade: value.grade,
						w: value.blockW,
						title: value.blockTitle,
						track: (value.track === 100) ? true : false,
						lessons: []
					})
				}
			} else {
				let found = this.display.findIndex(obj => obj.section === value.blockSection);
				if(found > -1) {
					let foundLesson = this.display[found].lessons.findIndex((less:any) => less.number === value.blockNumber);
					if(foundLesson > -1) {
						this.display[found].lessons[foundLesson].grade = value.grade;
						this.display[found].lessons[foundLesson].w = value.blockW;
						this.display[found].lessons[foundLesson].title = value.blockTitle;
						this.display[found].lessons[foundLesson].type = value.blockType;
						this.display[found].lessons[foundLesson].track = (value.track === 100) ? true : false;
					} else {
						this.display[found].lessons.push({
							id: value.blockId,
							number: value.blockNumber,
							grade: value.grade,
							w: value.blockW,
							title: value.blockTitle,
							type: value.blockType,
							track: (value.track === 100) ? true : false
						})
					}
				}
			}
		});
		this.display.forEach(grade => {
			let wSection = 0;
			grade.lessons.forEach((lesson:any) => {
				wSection += lesson.w;
			});
			grade.wSection = wSection;
			grade.grade = grade.lessons.reduce((acc:any,curr:any) => acc + (curr.grade * curr.w / grade.wSection),0);
		});
		console.group('Display');
		console.log(this.display);
		console.groupEnd();
		grades.blocks.forEach((value: any) => {
			if(value.blockNumber === 0) {
				this.totalPercentage += value.blockW / this.totalW;
				this.finalGrade += value.blockW * value.grade / this.totalW;
			}
		});
		if((this.finalGrade - this.grade.finalGrade) > 0.1) {
			this.finalGrade = this.grade.finalGrade;
		}
		return grades;
	}

}
