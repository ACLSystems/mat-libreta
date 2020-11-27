import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'mat-libreta-freshworks-crm',
  templateUrl: './freshworks-crm.component.html',
  styleUrls: ['./freshworks-crm.component.css']
})
export class FreshworksCRMComponent implements OnInit {

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Freshworks-crm - ACL Systems');
		this.meta.updateTag({
			name: 'og:title',
			content: 'Freshworks-crm - ACL Systems'
		});
		this.meta.updateTag({
			name: 'twitter:title',
			content: 'Freshworks-crm - ACL Systems'
		});
		this.meta.updateTag({
			name: 'description',
			content: 'Freshworks-crm - ACL Systems'
		});
		this.meta.updateTag({
			name: 'twitter:description',
			content: 'Freshworks-crm - ACL Systems'
		});
		this.meta.updateTag({
			name: 'keywords',
			content: 'Freshworks-crm - ACL Systems'
		})
  
  }

}
