import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PagesService } from '../pages.service';
import { environment } from '@cjaenv/environment';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
	providers: [PagesService]
})
export class CourseComponent implements OnInit, AfterViewInit {

  loading: boolean;
  costo: number;
  cursos: any = [];
  curso: any = [];
  blocks: any = [];
  sections: any [] = [];
  contents: any [] = [];
  idc: string;
  modaltype: any;
  members = 0;
  maxmembers: number [] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
	color: string;

  constructor(
		private activeRoute: ActivatedRoute,
		private router: Router,
		private pagesService: PagesService
	) {
		this.color = environment.color;
    this.activeRoute.params.subscribe( params =>{
      if (params.id != null) {
        this.idc = params.id;
      }
    });
	}

  ngOnInit() {
		this.getCourse(this.idc);
  }

	ngAfterViewInit() {
		let $navbar = document.getElementsByClassName('navbar')[0];
		$navbar.classList.remove('navbar-transparent');
		// $navbar.classList.remove('bg-primary');
		// $navbar.classList.add('bg-white');
	}

	public getCourse(id:string){
    this.loading = true;
    this.pagesService.getCoursesOrg().subscribe(data => {
			if(data && data.body && data.body.message && data.body.message.courses){
	      this.cursos = data.body.message.courses;
	      this.curso = this.cursos.find((c:any) => c.id == id);
			}
      this.loading = false;
    });

    this.pagesService.showBlocks(id).subscribe(data => {
			if(data && data.body && data.body.message && data.body.message.blocks) {
      	this.blocks = data.body.message.blocks;
			}
      this.loading = false;
    });
  }

  public verCurso(curso:string) {
    this.router.navigate(['/pages/course',curso]);
  }

}
