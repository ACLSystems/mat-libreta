import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserCourseService, Block } from '@mat-libreta/shared';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
	providers: [
		UserCourseService
	]
})
export class BlockComponent implements OnInit {

	groupid: string;
	blockid: string;
	loading: boolean;
	blockData: Block;


  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private userCourseService: UserCourseService
	) {
		this.loading = true;
		this.activatedRoute.params.subscribe(params => {
				this.groupid = params.groupid;
				this.blockid = params.blockid;
			}
		)
	}

  ngOnInit() {
		this.loading = true;
		this.getNextBlock(this.groupid,this.blockid);
  }

	getNextBlock(groupid:string, blockid:string, lastid?:string) {
		this.userCourseService.getNextBlock(groupid,blockid,lastid)
		.subscribe(data => {
			if(data) {
				this.blockData = data.message;
				this.blockid = blockid;

				if(this.blockData.blockType === 'task') {
					// this.blockGrade = this.blockData.blockGrade;
					// this.blockGradedT = this.blockData.blockGradedT;
				}
				// console.log('block')
				// console.log(this.blockData);
				window.scroll(0,0);
				this.loading = false;
			}
		})
	}

	goGroup(groupid:string) {
		this.router.navigate(['/user/content', groupid])
	}

}
