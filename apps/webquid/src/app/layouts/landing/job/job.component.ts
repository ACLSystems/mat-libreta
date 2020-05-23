import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mat-libreta-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {

	loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
