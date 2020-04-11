import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserCourseService, NotElemService, Block } from '@mat-libreta/shared';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
	providers: [
		UserCourseService
	]
})
export class BlockComponent implements OnInit {

	id: string;
	rosterType: string;
	blockid: string;
	loading: boolean;
	blockData: Block;


  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userCourseService: UserCourseService,
		private notElementService: NotElemService
	) {
		this.loading = true;
		this.activatedRoute.params.subscribe(params => {
			this.rosterType = params.rostertype;
			this.id = params.id;
			this.blockid = params.blockid;
		})
	}

  ngOnInit() {
		this.loading = true;
		this.getNextBlock(this.rosterType,this.id,this.blockid);
  }

	getNextBlock(
		rosterType:string,
		id:string,
		blockid:string,
		lastid?:string) {
		this.userCourseService.getNextBlock(rosterType,id,blockid,lastid)
		.subscribe(data => {
			if(data) {
				this.blockData = data.message;
				this.blockid = blockid;

				if(this.blockData.blockType === 'task') {
					// this.blockGrade = this.blockData.blockGrade;
					// this.blockGradedT = this.blockData.blockGradedT;
				}
				// console.group('block')
				// console.log(this.blockData);
				// console.groupEnd();
				if(!this.blockData.blockNextId || this.blockData.blockNextId === '') {
					this.notElementService.showNotification(
						'bottom',
						'left',
						'warning',
						'<i class="fas fa-stop text-white"></i> Has llegado al final del curso. Si ya realizaste tus evaluaciones, revisa tu progreso y descarga tu constancia'
					);
				}
				window.scroll(0,0);
				this.loading = false;
			}
		})
	}

	goGroup(rosterType: string, id:string) {
		this.router.navigate(['/user/content', rosterType, id])
	}

}
