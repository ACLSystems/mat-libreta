import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import Swal from 'sweetalert2';

// import { Identity } from '@cjashared/types/user.type';
//
// import { PagesService } from '../pages.service';
// import { UserService } from '@cjashared/services/user.service';
// import { environment } from '@cjaenv/environment';

@Component({
	selector: 'app-univ',
	templateUrl: './univ.component.html',
	styleUrls: ['./univ.component.scss']
})
export class UnivComponent implements OnInit, AfterViewInit {

	/*
	Constructor de la clase
	*/
	constructor(
		private Meta:Meta,
	) {
		this.Meta.addTag(
			{
				name:'description',
				content:'Supérate Mexico es una iniciativa de capacitación en línea que te ayuda en tu desarrollo profesional, adquiriendo nuevas competencias y dándole valor a tus conocimientos'
			}
		);
	}

	ngOnInit() {

	}

	@HostListener('window:scroll', ['$event'])
	scrollHandler(event?:any) {
		let pos = document.documentElement.scrollTop;
		let $navbar = document.getElementsByClassName('navbar')[0];
		if(pos > 100){
			$navbar.classList.remove('navbar-transparent');
			// $navbar.classList.remove('bg-primary');
			$navbar.classList.add('bg-light');
		} else {
			$navbar.classList.add('navbar-transparent');
			$navbar.classList.remove('bg-light');
			$navbar.classList.add('bg-primary');
		}
	}

	ngAfterViewInit() {
		let $navbar = document.getElementsByClassName('navbar')[0];
		$navbar.classList.add('navbar-transparent');
		$navbar.classList.add('bg-primary');
		$navbar.classList.remove('bg-white');
	}

	info() {
		Swal.fire({
			'type': 'info',
			'text': 'Mándanos un correo a correo@correo.com indicando la carrera de interés y en menos de 48 horas te daremos más información.'
		});
	}
}
