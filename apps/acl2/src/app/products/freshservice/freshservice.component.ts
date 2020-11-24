import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'mat-libreta-freshservice',
  templateUrl: './freshservice.component.html',
  styleUrls: ['./freshservice.component.css']
})
export class FreshserviceComponent implements OnInit {

  constructor(
		private title: Title,
		private meta: Meta,
		private router: Router
	) { }

  ngOnInit(): void {
		this.title.setTitle('Freshservice - Mesa de Servicio verdaderamente fácil de usar - ACL Systems');
		this.meta.updateTag({
			name: 'og:title',
			content: 'Freshservice - Mesa de Servicio verdaderamente fácil de usar - ACL Systems'
		});
		this.meta.updateTag({
			name: 'twitter:title',
			content: 'Freshservice - Mesa de Servicio verdaderamente fácil de usar - ACL Systems'
		});
		this.meta.updateTag({
			name: 'description',
			content: 'ACL Systems provee Freshservice, software de ITSM en nube para tu mesa de servicio - Poderosa herramienta de automatización para gestionar incidentes, activos, cambios, problemas y más.'
		});
		this.meta.updateTag({
			name: 'twitter:description',
			content: 'ACL Systems provee Freshservice, software de ITSM en nube para tu mesa de servicio - Poderosa herramienta de automatización para gestionar incidentes, activos, cambios, problemas y más.'
		});
		this.meta.updateTag({
			name: 'keywords',
			content: 'ITSM, ITIL, automatización, automation, IT helpdesk, IT service desk, Mesa de servicio, Mesa de ayuda, service management, cloud orchestration, IT operations management, ITOM, IT asset management, asset management, project management, SCRUM, software asset management, incident management, problem management, change management, release management, ITOM, ITAM, SAM, vendor management, alert management, self service, autoservicio, portal de autoservicio, service catalog, IT service catalog, catálogo de servicios'
		})
  }

}
