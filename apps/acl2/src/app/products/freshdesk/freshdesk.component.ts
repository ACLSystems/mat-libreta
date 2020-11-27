import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'mat-libreta-freshdesk',
  templateUrl: './freshdesk.component.html',
  styleUrls: ['./freshdesk.component.css']
})
export class FreshdeskComponent implements OnInit {

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Freshdesk - ACL Systems');
		this.meta.updateTag({
			name: 'og:title',
			content: 'Freshdesk - ACL Systems'
		});
		this.meta.updateTag({
			name: 'twitter:title',
			content: 'Freshdesk - ACL Systems'
		});
		this.meta.updateTag({
			name: 'description',
			content: 'Freshdesk - ACL Systems'
		});
		this.meta.updateTag({
			name: 'twitter:description',
			content: 'Freshdesk - ACL Systems'
		});
		this.meta.updateTag({
			name: 'keywords',
			content: 'Freshdesk - ACL Systems'
		})
  
  }

}
