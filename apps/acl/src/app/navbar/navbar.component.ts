import { Component, OnInit, ElementRef } from '@angular/core';

const misc: any = {
		navbar_menu_visible: 0,
		active_collapse: true,
		disabled_collapse_init: 0,
};

@Component({
  selector: 'acl-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

	private toggleButton: any;
	mobile_menu_visible: any = 0;
	private sidebarVisible: boolean;


  constructor(
		private element: ElementRef
	) { }

  ngOnInit(): void {
		const navbar: HTMLElement = this.element.nativeElement;
		const body = document.getElementsByTagName('body')[0];
		this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
		if (body.classList.contains('sidebar-mini')) {
				misc.sidebar_mini_active = true;
		}
		if (body.classList.contains('hide-sidebar')) {
				misc.hide_sidebar_active = true;
		}
  }

	sidebarOpen() {
		var $toggle = document.getElementsByClassName('navbar-toggler')[0];
			const toggleButton = this.toggleButton;
			const body = document.getElementsByTagName('body')[0];
			setTimeout(function(){
				toggleButton.classList.add('toggled');
			}, 500);
			body.classList.add('nav-open');
			setTimeout(function() {
					$toggle.classList.add('toggled');
			}, 430);

			var $layer = document.createElement('div');
			$layer.setAttribute('class', 'close-layer');


			if (body.querySelectorAll('.main-panel')) {
					document.getElementsByClassName('main-panel')[0].appendChild($layer);
			}else if (body.classList.contains('off-canvas-sidebar')) {
					document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
			}

			setTimeout(function() {
					$layer.classList.add('visible');
			}, 100);

			$layer.onclick = function() { //asign a function
				body.classList.remove('nav-open');
				this.mobile_menu_visible = 0;
				this.sidebarVisible = false;

				$layer.classList.remove('visible');
				setTimeout(function() {
						$layer.remove();
						$toggle.classList.remove('toggled');
				}, 400);
			}.bind(this);

			body.classList.add('nav-open');
			this.mobile_menu_visible = 1;
			this.sidebarVisible = true;
	};
	sidebarClose() {
		var $toggle = document.getElementsByClassName('navbar-toggler')[0];
			const body = document.getElementsByTagName('body')[0];
			this.toggleButton.classList.remove('toggled');
			var $layer = document.createElement('div');
			$layer.setAttribute('class', 'close-layer');

			this.sidebarVisible = false;
			body.classList.remove('nav-open');
			// $('html').removeClass('nav-open');
			body.classList.remove('nav-open');
			if ($layer) {
					$layer.remove();
			}

			setTimeout(function() {
					$toggle.classList.remove('toggled');
			}, 400);

			this.mobile_menu_visible = 0;
	};
	sidebarToggle() {
			if (this.sidebarVisible === false) {
					this.sidebarOpen();
			} else {
					this.sidebarClose();
			}
	}

}
